import * as fs from "node:fs"
import * as path from "node:path"

// ### Type Definitions

/** Represents an OpenAPI schema structure */
type OpenAPISchema = {
	$ref?: string
	allOf?: OpenAPISchema[]
	type?: string
	properties?: Record<string, OpenAPISchema>
	required?: string[]
	description?: string
	enum?: string[]
	items?: OpenAPISchema
	components?: {
		schemas?: Record<string, OpenAPISchema>
		responses?: Record<
			string,
			{
				description: string
				content?: Record<
					string,
					{
						schema: OpenAPISchema
					}
				>
			}
		>
	}
	paths?: Record<
		string,
		{
			[method: string]: {
				parameters?: Array<{
					$ref?: string
					in: string
					name: string
					required?: boolean
					schema: OpenAPISchema
					description?: string
				}>
				responses: Record<
					string,
					{
						$ref?: string
						description?: string
						content?: Record<
							string,
							{
								schema: OpenAPISchema
							}
						>
					}
				>
				requestBody?: {
					$ref?: string
					content?: Record<
						string,
						{
							schema: OpenAPISchema
						}
					>
				}
			}
		}
	>
}

/** Zod Abstract Syntax Tree (AST) for type-safe schema representation */
type ZodAST =
	| {
			type: "object"
			properties: Record<string, ZodAST>
			required: string[]
			description?: string
	  }
	| { type: "string"; description?: string }
	| { type: "number"; description?: string }
	| { type: "boolean"; description?: string }
	| { type: "array"; items: ZodAST; description?: string }
	| { type: "enum"; values: string[]; description?: string }
	| { type: "reference"; ref: string; description?: string }
	| { type: "literal"; value: string | number | boolean; description?: string }
	| { type: "extend"; base: ZodAST; extension: ZodAST; description?: string }
	| { type: "allOf"; schemas: ZodAST[]; description?: string }
	| { type: "undefined"; description?: string }

// ### Utility Functions

/** Extracts schema name from a $ref string */
function getSchemaNameFromRef(ref: string): string | null {
	if (ref.startsWith("#/components/schemas/")) {
		const parts = ref.split("/")
		return parts[parts.length - 1]
	}
	return null
}

/** Collects all schema names referenced by a schema */
function getReferencedSchemas(schema: OpenAPISchema): Set<string> {
	const refs = new Set<string>()

	if (schema.$ref) {
		const schemaName = getSchemaNameFromRef(schema.$ref)
		if (schemaName) {
			refs.add(schemaName)
		}
	} else if (schema.allOf) {
		for (const subSchema of schema.allOf) {
			const subRefs = getReferencedSchemas(subSchema)
			for (const ref of subRefs) {
				refs.add(ref)
			}
		}
	} else if (schema.properties) {
		for (const propSchema of Object.values(schema.properties)) {
			const subRefs = getReferencedSchemas(propSchema)
			for (const ref of subRefs) {
				refs.add(ref)
			}
		}
	} else if (schema.type === "array" && schema.items) {
		const subRefs = getReferencedSchemas(schema.items)
		for (const ref of subRefs) {
			refs.add(ref)
		}
	}

	return refs
}

/** Performs a topological sort on schema names based on dependencies */
function topologicalSort(
	nodes: string[],
	dependencies: Record<string, string[]>
): string[] {
	const visited = new Set<string>()
	const result: string[] = []

	function dfs(node: string) {
		if (visited.has(node)) {
			return
		}
		visited.add(node)
		for (const dep of dependencies[node] || []) {
			dfs(dep)
		}
		result.push(node)
	}

	for (const node of nodes) {
		dfs(node)
	}

	return result
}

/** Resolves an OpenAPI $ref to the actual schema object */
function resolveRef(openapi: OpenAPISchema, ref: string): OpenAPISchema {
	if (!ref.startsWith("#/")) {
		throw new Error("Only local references are supported")
	}
	const parts = ref.slice(2).split("/")
	let current: unknown = openapi
	for (const part of parts) {
		current = (current as Record<string, unknown>)[part]
		if (!current) {
			throw new Error(`Reference ${ref} not found`)
		}
	}
	return current as OpenAPISchema
}

/** Converts an OpenAPI schema to a Zod AST */
function openApiSchemaToZodAst(
	schema: OpenAPISchema,
	refResolver: (ref: string) => string
): ZodAST {
	if (schema.properties) {
		const properties: Record<string, ZodAST> = {}
		const required = schema.required || []
		const schemaProperties = schema.properties || {}
		for (const [propName, propSchema] of Object.entries(
			schemaProperties as Record<string, OpenAPISchema>
		)) {
			properties[propName] = openApiSchemaToZodAst(propSchema, refResolver)
		}
		return {
			type: "object",
			properties,
			required,
			description: schema.description
		}
	}

	if (schema.$ref) {
		if (typeof schema.$ref !== "string") {
			throw new Error("Invalid $ref value: must be a string")
		}
		return {
			type: "reference",
			ref: refResolver(schema.$ref),
			description: schema.description
		}
	}

	if (schema.allOf) {
		if (
			schema.allOf.length === 2 &&
			schema.allOf[0].$ref &&
			(schema.allOf[1].type === "object" || schema.allOf[1].properties)
		) {
			const base = openApiSchemaToZodAst(schema.allOf[0], refResolver)
			const extension = openApiSchemaToZodAst(schema.allOf[1], refResolver)
			return {
				type: "extend",
				base,
				extension,
				description: schema.description
			}
		}
		const allOfSchemas = schema.allOf.map((s) =>
			openApiSchemaToZodAst(s, refResolver)
		)
		return {
			type: "allOf",
			schemas: allOfSchemas,
			description: schema.description
		}
	}

	switch (schema.type) {
		case "object": {
			const properties: Record<string, ZodAST> = {}
			const required = schema.required || []
			const schemaProperties = schema.properties || {}
			for (const [propName, propSchema] of Object.entries(
				schemaProperties as Record<string, OpenAPISchema>
			)) {
				properties[propName] = openApiSchemaToZodAst(propSchema, refResolver)
			}
			return {
				type: "object",
				properties,
				required,
				description: schema.description
			}
		}
		case "string": {
			if (schema.enum) {
				if (!Array.isArray(schema.enum)) {
					throw new Error("Enum must be an array of strings")
				}
				return {
					type: "enum",
					values: schema.enum,
					description: schema.description
				}
			}
			return { type: "string", description: schema.description }
		}
		case "number":
			return { type: "number", description: schema.description }
		case "boolean":
			return { type: "boolean", description: schema.description }
		case "array": {
			if (!schema.items) {
				throw new Error("Array schema must include an 'items' definition")
			}
			const itemsAst = openApiSchemaToZodAst(schema.items, refResolver)
			return { type: "array", items: itemsAst, description: schema.description }
		}
		default:
			return {
				type: "string",
				description: schema.description || "Unknown type defaulted to string"
			}
	}
}

/** Generates TypeScript code using Zod from a Zod AST */
function generateZodCode(ast: ZodAST): string {
	switch (ast.type) {
		case "object": {
			const props = Object.entries(ast.properties).map(
				([propName, propAst]) => {
					let propCode = generateZodCode(propAst)
					if (!ast.required.includes(propName)) {
						propCode += ".optional()"
					}
					return `${JSON.stringify(propName)}: ${propCode}`
				}
			)
			let code = `z.object({ ${props.join(", ")} })`
			if (ast.description) {
				code += `.describe(${JSON.stringify(ast.description)})`
			}
			return code
		}
		case "string": {
			let code = "z.string()"
			if (ast.description) {
				code += `.describe(${JSON.stringify(ast.description)})`
			}
			return code
		}
		case "number": {
			let code = "z.number()"
			if (ast.description) {
				code += `.describe(${JSON.stringify(ast.description)})`
			}
			return code
		}
		case "boolean": {
			let code = "z.boolean()"
			if (ast.description) {
				code += `.describe(${JSON.stringify(ast.description)})`
			}
			return code
		}
		case "array": {
			const itemsCode = generateZodCode(ast.items)
			let code = `z.array(${itemsCode})`
			if (ast.description) {
				code += `.describe(${JSON.stringify(ast.description)})`
			}
			return code
		}
		case "enum": {
			let code = `z.enum(${JSON.stringify(ast.values)})`
			if (ast.description) {
				code += `.describe(${JSON.stringify(ast.description)})`
			}
			return code
		}
		case "reference":
			return ast.ref
		case "literal": {
			let code = `z.literal(${JSON.stringify(ast.value)})`
			if (ast.description) {
				code += `.describe(${JSON.stringify(ast.description)})`
			}
			return code
		}
		case "extend": {
			const baseCode = generateZodCode(ast.base)
			if (ast.extension.type !== "object") {
				throw new Error("Extension must be an object schema")
			}
			const ext = ast.extension as {
				type: "object"
				properties: Record<string, ZodAST>
				required: string[]
			}
			const props = Object.entries(ext.properties).map(
				([propName, propAst]) => {
					let propCode = generateZodCode(propAst)
					if (!ext.required.includes(propName)) {
						propCode += ".optional()"
					}
					return `${JSON.stringify(propName)}: ${propCode}`
				}
			)
			let code = `${baseCode}.extend({ ${props.join(", ")} })`
			if (ast.description) {
				code += `.describe(${JSON.stringify(ast.description)})`
			}
			return code
		}
		case "allOf": {
			if (ast.schemas.length === 0) {
				throw new Error("allOf must have at least one schema")
			}
			let code = generateZodCode(ast.schemas[0])
			for (let i = 1; i < ast.schemas.length; i++) {
				code = `z.intersection(${code}, ${generateZodCode(ast.schemas[i])})`
			}
			if (ast.description) {
				code += `.describe(${JSON.stringify(ast.description)})`
			}
			return code
		}
		case "undefined": {
			let code = "z.undefined()"
			if (ast.description) {
				code += `.describe(${JSON.stringify(ast.description)})`
			}
			return code
		}
	}
}

/** Resolves an OpenAPI $ref to a variable name */
function getSchemaVariable(ref: string): string {
	const parts = ref.split("/")
	const schemaName = parts[parts.length - 1]
	if (!schemaName) {
		throw new Error(`Invalid schema reference: ${ref}`)
	}
	return `${schemaName[0].toLowerCase()}${schemaName.slice(1)}Schema`
}

/** Generates Zod schema definitions for all components.schemas in dependency order */
function generateSchemaDefinitions(openapi: OpenAPISchema): string[] {
	const definitions: string[] = []
	const schemas = openapi.components?.schemas || {}
	const dependencies: Record<string, string[]> = {}
	for (const schemaName of Object.keys(schemas)) {
		const schema = schemas[schemaName]
		const referenced = getReferencedSchemas(schema)
		dependencies[schemaName] = Array.from(referenced)
	}
	const orderedSchemaNames = topologicalSort(Object.keys(schemas), dependencies)
	for (const schemaName of orderedSchemaNames) {
		const schema = schemas[schemaName]
		const variableName = getSchemaVariable(`#/components/schemas/${schemaName}`)
		const ast = openApiSchemaToZodAst(schema, getSchemaVariable)
		const code = generateZodCode(ast)
		definitions.push(`const ${variableName} = ${code};`)
	}
	return definitions
}

/** Gets the Zod AST for a response's body schema */
function getResponseSchema(
	response: OpenAPISchema & {
		content?: Record<string, { schema: OpenAPISchema }>
	},
	openapi: OpenAPISchema,
	refResolver: (ref: string) => string
): ZodAST {
	if (response.$ref) {
		const resolvedResponse = resolveRef(openapi, response.$ref)
		return getResponseSchema(resolvedResponse, openapi, refResolver)
	}
	if (response.content?.["application/json"]?.schema) {
		return openApiSchemaToZodAst(
			response.content["application/json"].schema,
			refResolver
		)
	}
	return { type: "undefined" }
}

/** Generates the response schemas for a specific operation */
function generateResponseSchemas(
	operation: {
		responses?: Record<
			string,
			OpenAPISchema & {
				content?: Record<string, { schema: OpenAPISchema }>
			}
		>
	},
	openapi: OpenAPISchema
): string[] {
	const responses = operation.responses || {}

	const branches: string[] = []
	let defaultBranch: string | null = null

	for (const [status, response] of Object.entries(responses)) {
		const responseSchemaAst = getResponseSchema(
			response,
			openapi,
			getSchemaVariable
		)
		const responseSchemaCode = generateZodCode(responseSchemaAst)
		if (status === "default") {
			defaultBranch = `z.object({ status: z.number().min(100).max(599), body: ${responseSchemaCode} })`
		} else if (/^\d+$/.test(status)) {
			const statusNumber = Number.parseInt(status, 10)
			branches.push(
				`z.object({ status: z.literal(${statusNumber}), body: ${responseSchemaCode} })`
			)
		} else {
			throw new Error(`Unsupported status code: ${status}`)
		}
	}

	if (defaultBranch) {
		branches.push(defaultBranch)
	}

	const responseSchemaCode = `export const responseSchema = z.union([${branches.join(", ")}]);`
	return [responseSchemaCode]
}

/** Generates the request schema for a specific operation */
function generateRequestSchema(
	operation: {
		parameters?: Array<{
			$ref?: string
			in: string
			name: string
			required?: boolean
			schema: OpenAPISchema
			description?: string
		}>
		requestBody?: {
			$ref?: string
			content?: Record<string, { schema: OpenAPISchema }>
		}
	},
	openapi: OpenAPISchema,
	refResolver: (ref: string) => string
): string {
	type Parameter = {
		$ref?: string
		in: string
		name: string
		required?: boolean
		schema: OpenAPISchema
		description?: string
	}

	let params = operation.parameters || []
	params = params.map((param) =>
		param.$ref ? (resolveRef(openapi, param.$ref) as Parameter) : param
	)

	const pathParams = params.filter((p) => p.in === "path")
	const queryParams = params.filter((p) => p.in === "query")

	const pathSchemaAst: ZodAST = {
		type: "object",
		properties: {},
		required: []
	}
	for (const param of pathParams) {
		if (!param.schema) {
			throw new Error(`Parameter ${param.name} has no schema`)
		}
		const paramAst = openApiSchemaToZodAst(param.schema, refResolver)
		if (param.description) {
			paramAst.description = param.description
		}
		pathSchemaAst.properties[param.name] = paramAst
		if (param.required) {
			pathSchemaAst.required.push(param.name)
		}
	}

	const querySchemaAst: ZodAST = {
		type: "object",
		properties: {},
		required: []
	}
	for (const param of queryParams) {
		if (!param.schema) {
			throw new Error(`Parameter ${param.name} has no schema`)
		}
		const paramAst = openApiSchemaToZodAst(param.schema, refResolver)
		if (param.description) {
			paramAst.description = param.description
		}
		querySchemaAst.properties[param.name] = paramAst
		if (param.required) {
			querySchemaAst.required.push(param.name)
		}
	}

	let bodyAst: ZodAST = { type: "undefined" }
	if (operation.requestBody) {
		let requestBody = operation.requestBody
		if (requestBody.$ref) {
			requestBody = resolveRef(openapi, requestBody.$ref)
		}
		if (requestBody.content?.["application/json"]?.schema) {
			bodyAst = openApiSchemaToZodAst(
				requestBody.content["application/json"].schema,
				refResolver
			)
		}
	}

	const requestAst: ZodAST = {
		type: "object",
		properties: {
			path: pathSchemaAst,
			query: querySchemaAst,
			body: bodyAst
		},
		required: ["path", "query", "body"]
	}

	return `export const requestSchema = ${generateZodCode(requestAst)};`
}

/** Transforms an OpenAPI schema to Zod TypeScript code for a specific operation */
function transformOpenApiToZod(openapi: OpenAPISchema): string {
	const schemaDefs = generateSchemaDefinitions(openapi)

	const paths = openapi.paths
	if (!paths || Object.keys(paths).length === 0) {
		throw new Error("No paths found in OpenAPI schema")
	}
	const pathKey = Object.keys(paths)[0]
	const pathOperations = paths[pathKey]
	const method = Object.keys(pathOperations)[0]
	const operation = pathOperations[method]

	const responseDefs = generateResponseSchemas(operation, openapi)
	const requestCode = generateRequestSchema(
		operation,
		openapi,
		getSchemaVariable
	)

	return `
import { z } from "zod";

${schemaDefs.join("\n\n")}

${responseDefs.join("\n\n")}

${requestCode}
    `.trim()
}

// ### Exports and CLI

export { transformOpenApiToZod }

if (require.main === module) {
	const args = process.argv.slice(2)
	if (args.length !== 2) {
		console.error(
			"Usage: ts-node script.ts <input-openapi.json> <output-zod.ts>"
		)
		process.exit(1)
	}
	const [inputFile, outputFile] = args
	try {
		const openapiJson = fs.readFileSync(path.resolve(inputFile), "utf-8")
		const openapi = JSON.parse(openapiJson) as OpenAPISchema
		const zodCode = transformOpenApiToZod(openapi)
		fs.writeFileSync(path.resolve(outputFile), zodCode)
		console.log(`Zod schemas written to ${outputFile}`)
	} catch (error) {
		console.error("Error:", (error as Error).message)
		process.exit(1)
	}
}
