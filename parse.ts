import * as fs from "node:fs"
import * as yaml from "js-yaml"

// Type definitions for OpenAPI spec structure
export interface OpenAPIInfo {
	title: string
	version: string
	[key: string]: string | number | boolean | object
}

export interface OpenAPIServer {
	url: string
	[key: string]: string | number | boolean | object
}

export interface OpenAPISchema {
	type?: string
	properties?: Record<string, OpenAPISchema>
	items?: OpenAPISchema
	$ref?: string
	[key: string]: unknown
}

export interface OpenAPIParameter {
	name: string
	in: string
	schema?: OpenAPISchema
	$ref?: string
	[key: string]: unknown
}

export interface OpenAPIResponse {
	description: string
	content?: Record<string, { schema: OpenAPISchema }>
	$ref?: string
	[key: string]: unknown
}

export interface OpenAPISecurityScheme {
	type: string
	scheme?: string
	[key: string]: unknown
}

export interface OpenAPIComponent {
	schemas?: Record<string, OpenAPISchema>
	parameters?: Record<string, OpenAPIParameter>
	responses?: Record<string, OpenAPIResponse>
	securitySchemes?: Record<string, OpenAPISecurityScheme>
	[key: string]: Record<string, unknown> | undefined
}

export interface OpenAPIOperation {
	summary?: string
	parameters?: OpenAPIParameter[]
	responses?: Record<string, OpenAPIResponse>
	security?: Record<string, string[]>[]
	[key: string]: unknown
}

export interface OpenAPIPath {
	get?: OpenAPIOperation
	post?: OpenAPIOperation
	put?: OpenAPIOperation
	delete?: OpenAPIOperation
	[key: string]: unknown
}

export interface OpenAPISpec {
	openapi: string
	info: OpenAPIInfo
	servers?: OpenAPIServer[]
	paths: Record<string, OpenAPIPath>
	components?: OpenAPIComponent
	[key: string]: unknown
}

/**
 * Recursively collects all `$ref` strings from an object.
 * @param obj - The object to traverse.
 * @param refs - Set to store collected `$ref` strings.
 * @returns Set of `$ref` strings.
 */
function collectRefs(obj: unknown, refs: Set<string> = new Set()): Set<string> {
	if (typeof obj !== "object" || obj === null) {
		return refs
	}

	if (Array.isArray(obj)) {
		for (const item of obj) {
			collectRefs(item, refs)
		}
	} else {
		for (const [key, value] of Object.entries(obj)) {
			if (key === "$ref" && typeof value === "string") {
				refs.add(value)
			} else {
				collectRefs(value, refs)
			}
		}
	}
	return refs
}

/**
 * Recursively collects security scheme names from an object.
 * @param obj - The object to traverse.
 * @param schemes - Set to store collected security scheme names.
 * @returns Set of security scheme names.
 */
function collectSecuritySchemes(
	obj: unknown,
	schemes: Set<string> = new Set()
): Set<string> {
	if (typeof obj !== "object" || obj === null) {
		return schemes
	}

	if (Array.isArray(obj)) {
		for (const item of obj) {
			collectSecuritySchemes(item, schemes)
		}
	} else {
		for (const [key, value] of Object.entries(obj)) {
			if (key === "security" && Array.isArray(value)) {
				for (const securityItem of value) {
					for (const schemeName of Object.keys(securityItem)) {
						schemes.add(schemeName)
					}
				}
			} else {
				collectSecuritySchemes(value, schemes)
			}
		}
	}
	return schemes
}

/**
 * Parses a `$ref` string to extract component type and name.
 * @param ref - The `$ref` string (e.g., '#/components/schemas/Customer').
 * @returns Object with `type` and `name`, or `null` if invalid.
 */
function parseRef(ref: string): { type: string; name: string } | null {
	const parts = ref.split("/").slice(1) // Remove leading '#'
	if (parts[0] === "components" && parts.length === 3) {
		return { type: parts[1], name: parts[2] }
	}
	return null
}

/**
 * Builds a subset OpenAPI spec for a specific path, including only relevant components.
 * @param fullSpec - The complete OpenAPI spec object.
 * @param path - The URL path to process.
 * @returns Subset OpenAPI spec for the path.
 */
function buildPathSpec(fullSpec: OpenAPISpec, path: string): OpenAPISpec {
	const { paths, components, ...baseSpec } = fullSpec
	const pathSpec: OpenAPISpec = {
		...baseSpec,
		paths: { [path]: fullSpec.paths[path] }
	}

	const referencedComponents: Record<string, Set<string>> = {}
	const queue: unknown[] = [fullSpec.paths[path]]

	while (queue.length > 0) {
		const obj = queue.shift()
		const refs = collectRefs(obj)

		for (const ref of refs) {
			const parsed = parseRef(ref)
			if (parsed) {
				const { type, name } = parsed
				referencedComponents[type] = referencedComponents[type] || new Set()
				if (
					!referencedComponents[type].has(name) &&
					fullSpec.components?.[type]?.[name]
				) {
					referencedComponents[type].add(name)
					queue.push(fullSpec.components[type][name])
				}
			}
		}
	}

	const securitySchemes = collectSecuritySchemes(fullSpec.paths[path])
	if (securitySchemes.size > 0) {
		referencedComponents.securitySchemes = securitySchemes
	}

	if (Object.keys(referencedComponents).length > 0) {
		pathSpec.components = {}
		for (const type in referencedComponents) {
			if (Object.prototype.hasOwnProperty.call(referencedComponents, type)) {
				pathSpec.components[type] = {}
				for (const name of referencedComponents[type]) {
					const component = fullSpec.components?.[type]?.[name]
					if (component && pathSpec.components[type]) {
						pathSpec.components[type][name] = component
					}
				}
			}
		}
	}

	return pathSpec
}

/**
 * Parses an OpenAPI YAML file and returns a map of URL paths to their tree-shaken OpenAPI specs.
 * @param yamlFile - Path to the OpenAPI YAML file.
 * @returns Map of URL paths to subset OpenAPI specs.
 * @throws Error if file reading or parsing fails.
 */
export function parseOpenAPISpec(
	yamlFile: string
): Record<string, OpenAPISpec> {
	try {
		const yamlContent = fs.readFileSync(yamlFile, "utf8")
		const fullSpec = yaml.load(yamlContent) as OpenAPISpec

		if (!fullSpec.paths || typeof fullSpec.paths !== "object") {
			throw new Error(
				'Invalid OpenAPI spec: "paths" field is missing or invalid'
			)
		}

		const pathMap: Record<string, OpenAPISpec> = {}
		for (const path in fullSpec.paths) {
			pathMap[path] = buildPathSpec(fullSpec, path)
		}

		return pathMap
	} catch (error) {
		throw new Error(`Failed to parse OpenAPI spec: ${(error as Error).message}`)
	}
}

// Example usage (commented out):
// const result = parseOpenAPISpec('path/to/openapi.yaml');
// console.log(JSON.stringify(result, null, 2));
