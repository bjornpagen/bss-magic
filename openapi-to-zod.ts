import * as fs from "node:fs"
import * as path from "node:path"
import { removeUnusedVariablesFromCode } from "./remove-unused-vars"

// ### Type Definitions

/** Represents an OpenAPI schema structure */
type OpenAPISchema = {
	$ref?: string
	allOf?: OpenAPISchema[]
	oneOf?: OpenAPISchema[]
	type?: string
	format?: string
	properties?: Record<string, OpenAPISchema>
	required?: string[]
	description?: string
	enum?: string[]
	items?: OpenAPISchema
	nullable?: boolean
	discriminator?: {
		propertyName: string
		mapping?: Record<string, string>
	}
	components?: {
		schemas?: Record<string, OpenAPISchema>
		responses?: Record<
			string,
			{
				description: string
				content?: Record<string, { schema: OpenAPISchema }>
				headers?: Record<
					string,
					{ $ref?: string; schema?: OpenAPISchema; required?: boolean }
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
					in?: string
					name?: string
					required?: boolean
					schema?: OpenAPISchema
					description?: string
				}>
				responses: Record<
					string,
					{
						$ref?: string
						description?: string
						content?: Record<string, { schema: OpenAPISchema }>
						headers?: Record<
							string,
							{ $ref?: string; schema?: OpenAPISchema; required?: boolean }
						>
					}
				>
				requestBody?: {
					$ref?: string
					content?: Record<string, { schema: OpenAPISchema }>
					required?: boolean
				}
			}
		}
	>
	// Additional properties needed for response handling
	headers?: Record<
		string,
		{ $ref?: string; schema?: OpenAPISchema; required?: boolean }
	>
	content?: Record<string, { schema: OpenAPISchema }>
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
	| { type: "merge"; schemas: ZodAST[]; description?: string }
	| { type: "undefined"; description?: string }
	| {
			type: "discriminatedUnion"
			discriminator: string
			options: ZodAST[]
			description?: string
	  }
	| { type: "coerce"; schema: ZodAST; description?: string }
	| { type: "datetime"; description?: string }
	| { type: "any"; description?: string }
	| { type: "union"; options: ZodAST[]; description?: string }
	| { type: "nullable"; schema: ZodAST; description?: string }

/** Parameter type for clarity in path and query parameter handling */
type Parameter = {
	in: string
	name: string
	required?: boolean
	schema: OpenAPISchema
	description?: string
}

// ### Utility Functions

/** Extracts schema name from a $ref string */
function getSchemaNameFromRef(ref: string): string | null {
	if (ref.startsWith("#/components/schemas/")) {
		const parts = ref.split("/")
		return parts[parts.length - 1]
	}
	return null
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
	refResolver: (ref: string) => string,
	openapi: OpenAPISchema,
	schemaOptions: { coerce?: boolean; isHeader?: boolean } = {}
): ZodAST {
	if (schema.$ref) {
		const schemaName = getSchemaNameFromRef(schema.$ref)
		if (schemaName) {
			return {
				type: "reference",
				ref: refResolver(schema.$ref),
				description: schema.description
			}
		}
		const resolvedSchema = resolveRef(openapi, schema.$ref)
		return openApiSchemaToZodAst(
			resolvedSchema,
			refResolver,
			openapi,
			schemaOptions
		)
	}

	if (schema.oneOf) {
		if (schema.discriminator) {
			const discriminatorProp = schema.discriminator.propertyName
			const mapping = schema.discriminator.mapping || {}
			const unionOptions: ZodAST[] = []
			for (const subSchema of schema.oneOf) {
				if (subSchema.$ref) {
					const ref = subSchema.$ref
					const typeValue = Object.entries(mapping).find(
						([, value]) => value === ref
					)?.[0]
					if (typeValue) {
						const resolvedSchema = resolveRef(openapi, ref)
						const subAst = openApiSchemaToZodAst(
							resolvedSchema,
							refResolver,
							openapi,
							schemaOptions
						)
						if (subAst.type === "object") {
							const extendedProperties = { ...subAst.properties }
							extendedProperties[discriminatorProp] = {
								type: "literal",
								value: typeValue
							}
							const extendedRequired = subAst.required.includes(
								discriminatorProp
							)
								? subAst.required
								: [...subAst.required, discriminatorProp]
							unionOptions.push({
								type: "object",
								properties: extendedProperties,
								required: extendedRequired,
								description: subAst.description
							})
						} else {
							throw new Error("Resolved subschema in oneOf must be an object")
						}
					}
				}
			}
			return {
				type: "discriminatedUnion",
				discriminator: discriminatorProp,
				options: unionOptions,
				description: schema.description
			}
		}
		const schemaOneOf = schema.oneOf.map((subSchema) =>
			openApiSchemaToZodAst(subSchema, refResolver, openapi, schemaOptions)
		)
		let ast: ZodAST = {
			type: "union",
			options: schemaOneOf,
			description: schema.description
		}
		if (schema.nullable) {
			ast = { type: "nullable", schema: ast, description: schema.description }
		}
		return ast
	}

	if (schema.allOf) {
		const properties: Record<string, ZodAST> = {}
		const required: Set<string> = new Set(schema.required || [])
		for (const subSchema of schema.allOf) {
			const subAst = openApiSchemaToZodAst(
				subSchema,
				refResolver,
				openapi,
				schemaOptions
			)
			if (subAst.type === "object") {
				Object.assign(properties, subAst.properties)
				for (const req of subAst.required) {
					required.add(req)
				}
			} else if (subAst.type === "reference") {
				if (!subSchema.$ref) {
					throw new Error("Reference schema must have a $ref property")
				}
				const resolvedSchema = resolveRef(openapi, subSchema.$ref)
				const resolvedAst = openApiSchemaToZodAst(
					resolvedSchema,
					refResolver,
					openapi,
					schemaOptions
				)
				if (resolvedAst.type === "object") {
					Object.assign(properties, resolvedAst.properties)
					for (const req of resolvedAst.required) {
						required.add(req)
					}
				}
			}
		}
		return {
			type: "object",
			properties,
			required: Array.from(required),
			description: schema.description
		}
	}

	if (schema.properties) {
		const properties: Record<string, ZodAST> = {}
		const required = schema.required || []
		for (const [propName, propSchema] of Object.entries(
			schema.properties || {}
		)) {
			properties[propName] = openApiSchemaToZodAst(
				propSchema,
				refResolver,
				openapi,
				schemaOptions
			)
		}
		return {
			type: "object",
			properties,
			required,
			description: schema.description
		}
	}

	let ast: ZodAST
	switch (schema.type) {
		case "object": {
			ast = {
				type: "object",
				properties: {},
				required: schema.required || [],
				description: schema.description
			}
			break
		}
		case "string": {
			if (schema.format === "date-time") {
				ast = { type: "datetime", description: schema.description }
			} else if (schema.enum) {
				if (!Array.isArray(schema.enum)) {
					throw new Error("Enum must be an array of strings")
				}
				ast = {
					type: "enum",
					values: schema.enum,
					description: schema.description
				}
			} else {
				ast = { type: "string", description: schema.description }
			}
			break
		}
		case "number":
		case "integer": {
			ast = { type: "number", description: schema.description }
			if (schemaOptions.coerce || schemaOptions.isHeader) {
				ast = { type: "coerce", schema: ast, description: schema.description }
			}
			break
		}
		case "boolean": {
			ast = { type: "boolean", description: schema.description }
			break
		}
		case "array": {
			if (!schema.items) {
				throw new Error("Array schema must include an 'items' definition")
			}
			const itemsAst = openApiSchemaToZodAst(
				schema.items,
				refResolver,
				openapi,
				schemaOptions
			)
			ast = { type: "array", items: itemsAst, description: schema.description }
			break
		}
		default: {
			ast = { type: "any", description: schema.description }
		}
	}
	if (schema.nullable) {
		ast = { type: "nullable", schema: ast, description: schema.description }
	}
	return ast
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
			let codeStr = `z.object({ ${props.join(", ")} })`
			if (ast.description) {
				codeStr += `.describe(${JSON.stringify(ast.description)})`
			}
			return codeStr
		}
		case "string": {
			let codeStr = "z.string()"
			if (ast.description) {
				codeStr += `.describe(${JSON.stringify(ast.description)})`
			}
			return codeStr
		}
		case "number": {
			let codeStr = "z.number()"
			if (ast.description) {
				codeStr += `.describe(${JSON.stringify(ast.description)})`
			}
			return codeStr
		}
		case "boolean": {
			let codeStr = "z.boolean()"
			if (ast.description) {
				codeStr += `.describe(${JSON.stringify(ast.description)})`
			}
			return codeStr
		}
		case "array": {
			const itemsCode = generateZodCode(ast.items)
			let codeStr = `z.array(${itemsCode})`
			if (ast.description) {
				codeStr += `.describe(${JSON.stringify(ast.description)})`
			}
			return codeStr
		}
		case "enum": {
			let codeStr = `z.enum(${JSON.stringify(ast.values)})`
			if (ast.description) {
				codeStr += `.describe(${JSON.stringify(ast.description)})`
			}
			return codeStr
		}
		case "reference": {
			return `z.lazy(() => ${ast.ref})`
		}
		case "literal": {
			let codeStr = `z.literal(${JSON.stringify(ast.value)})`
			if (ast.description) {
				codeStr += `.describe(${JSON.stringify(ast.description)})`
			}
			return codeStr
		}
		case "merge": {
			if (ast.schemas.length === 0) {
				throw new Error("Merge must have at least one schema")
			}
			let codeStr = generateZodCode(ast.schemas[0])
			for (let i = 1; i < ast.schemas.length; i++) {
				codeStr = `${codeStr}.merge(${generateZodCode(ast.schemas[i])})`
			}
			if (ast.description) {
				codeStr += `.describe(${JSON.stringify(ast.description)})`
			}
			return codeStr
		}
		case "undefined": {
			let codeStr = "z.undefined()"
			if (ast.description) {
				codeStr += `.describe(${JSON.stringify(ast.description)})`
			}
			return codeStr
		}
		case "discriminatedUnion": {
			const optionsCode = ast.options
				.map((option) => generateZodCode(option))
				.join(", ")
			let codeStr = `z.discriminatedUnion(${JSON.stringify(ast.discriminator)}, [${optionsCode}])`
			if (ast.description) {
				codeStr += `.describe(${JSON.stringify(ast.description)})`
			}
			return codeStr
		}
		case "coerce": {
			let codeStr = "z.coerce.number()"
			if (ast.schema.type === "boolean") {
				codeStr = "z.coerce.boolean()"
			}
			if (ast.description) {
				codeStr += `.describe(${JSON.stringify(ast.description)})`
			}
			return codeStr
		}
		case "datetime": {
			let codeStr = "z.string().datetime()"
			if (ast.description) {
				codeStr += `.describe(${JSON.stringify(ast.description)})`
			}
			return codeStr
		}
		case "any": {
			let codeStr = "z.any()"
			if (ast.description) {
				codeStr += `.describe(${JSON.stringify(ast.description)})`
			}
			return codeStr
		}
		case "union": {
			let codeStr = `z.union([${ast.options
				.map((option) => generateZodCode(option))
				.join(", ")}])`
			if (ast.description) {
				codeStr += `.describe(${JSON.stringify(ast.description)})`
			}
			return codeStr
		}
		case "nullable": {
			let codeStr = `${generateZodCode(ast.schema)}.nullable()`
			if (ast.description) {
				codeStr += `.describe(${JSON.stringify(ast.description)})`
			}
			return codeStr
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

/** Generates the path parameters schema AST */
function generatePathParamsAst(
	operation: {
		parameters?: Array<{
			$ref?: string
			in?: string
			name?: string
			required?: boolean
			schema?: OpenAPISchema
			description?: string
		}>
	},
	openapi: OpenAPISchema,
	refResolver: (ref: string) => string
): ZodAST {
	const params = operation.parameters || []
	const pathParams = params
		.map((p) => (p.$ref ? (resolveRef(openapi, p.$ref) as Parameter) : p))
		.filter((p) => p.in === "path" && p.name && p.schema)
	const properties: Record<string, ZodAST> = {}
	const required: string[] = []
	for (const param of pathParams) {
		// We filtered to ensure these exist above
		const paramName = param.name as string
		const paramSchema = param.schema as OpenAPISchema

		const paramAst = openApiSchemaToZodAst(paramSchema, refResolver, openapi)
		if (param.description) {
			paramAst.description = param.description
		}
		properties[paramName] = paramAst
		if (param.required) {
			required.push(paramName)
		}
	}
	return { type: "object", properties, required }
}

/** Generates the query parameters schema AST */
function generateQueryParamsAst(
	operation: {
		parameters?: Array<{
			$ref?: string
			in?: string
			name?: string
			required?: boolean
			schema?: OpenAPISchema
			description?: string
		}>
	},
	openapi: OpenAPISchema,
	refResolver: (ref: string) => string
): ZodAST {
	const params = operation.parameters || []
	const queryParams = params
		.map((p) => (p.$ref ? (resolveRef(openapi, p.$ref) as Parameter) : p))
		.filter((p) => p.in === "query" && p.name && p.schema)
	const properties: Record<string, ZodAST> = {}
	const required: string[] = []
	for (const param of queryParams) {
		// We filtered to ensure these exist above
		const paramName = param.name as string
		const paramSchema = param.schema as OpenAPISchema

		const paramAst = openApiSchemaToZodAst(paramSchema, refResolver, openapi, {
			coerce: true
		})
		if (param.description) {
			paramAst.description = param.description
		}
		properties[paramName] = paramAst
		if (param.required) {
			required.push(paramName)
		}
	}
	return { type: "object", properties, required }
}

/** Generates the headers schema AST for responses */
function getHeadersSchemaAst(
	response: OpenAPISchema,
	contentType: string | null,
	openapi: OpenAPISchema,
	refResolver: (ref: string) => string
): ZodAST {
	const resolvedResponse = response.$ref
		? resolveRef(openapi, response.$ref)
		: response
	const headers = resolvedResponse.headers || {}
	const properties: Record<string, ZodAST> = {}
	const required: string[] = []

	for (const [headerName, headerDefRaw] of Object.entries(headers)) {
		const headerDef = headerDefRaw as {
			$ref?: string
			schema?: OpenAPISchema
			required?: boolean
		}
		let headerSchema: OpenAPISchema = headerDef.schema || {}
		if (headerDef.$ref) {
			const resolvedHeader = resolveRef(openapi, headerDef.$ref)
			headerSchema =
				"schema" in resolvedHeader ? resolvedHeader.schema || {} : headerSchema
		}
		const headerAst = openApiSchemaToZodAst(
			headerSchema,
			refResolver,
			openapi,
			{ isHeader: true }
		)
		properties[headerName] = headerAst
		if (headerDef.required) {
			required.push(headerName)
		}
	}

	if (contentType) {
		properties["content-type"] = { type: "literal", value: contentType }
		required.push("content-type")
	}

	return {
		type: "object",
		properties,
		required
	}
}

/** Transforms an OpenAPI schema to Zod TypeScript code for all operations */
function transformOpenApiToZod(openapi: OpenAPISchema): string {
	const paths = openapi.paths || {}
	const schemaDefs: string[] = []
	const requestSchemaCodes: string[] = []
	const responseSchemaCodes: string[] = []

	// Generate schema definitions
	const schemas = openapi.components?.schemas || {}
	for (const [schemaName, schema] of Object.entries(schemas)) {
		const variableName = getSchemaVariable(`#/components/schemas/${schemaName}`)
		const ast = openApiSchemaToZodAst(schema, getSchemaVariable, openapi)
		schemaDefs.push(`const ${variableName} = ${generateZodCode(ast)};`)
	}

	// Process paths and operations
	for (const [pathKey, pathOperations] of Object.entries(paths)) {
		for (const [method, operation] of Object.entries(pathOperations)) {
			// Generate path and query parameter schemas
			const pathSchemaAst = generatePathParamsAst(
				operation,
				openapi,
				getSchemaVariable
			)
			const querySchemaAst = generateQueryParamsAst(
				operation,
				openapi,
				getSchemaVariable
			)

			// Handle request schemas for operations with multiple content types
			const requestSchemaAsts: ZodAST[] = []
			const requestContentTypes: (string | null)[] = []
			const requestBody = operation.requestBody

			if (requestBody) {
				const resolvedRequestBody = requestBody.$ref
					? resolveRef(openapi, requestBody.$ref)
					: requestBody
				if (resolvedRequestBody.content) {
					for (const [contentType, mediaType] of Object.entries(
						resolvedRequestBody.content
					)) {
						const bodySchema = mediaType.schema
						if (bodySchema) {
							const headersAst: ZodAST = {
								type: "object",
								properties: {
									"Content-Type": { type: "literal", value: contentType }
								},
								required: ["Content-Type"]
							}
							const bodyAst = openApiSchemaToZodAst(
								bodySchema,
								getSchemaVariable,
								openapi
							)
							const requestSchemaAst: ZodAST = {
								type: "object",
								properties: {
									method: { type: "literal", value: method },
									path: pathSchemaAst,
									query: querySchemaAst,
									headers: headersAst,
									body: bodyAst
								},
								required: ["method", "path", "query", "headers"],
								description: `${method.toUpperCase()} request for ${pathKey} with ${contentType}`
							}
							if (resolvedRequestBody.required) {
								requestSchemaAst.required.push("body")
							}
							requestSchemaAsts.push(requestSchemaAst)
							requestContentTypes.push(contentType)
						}
					}
				}
			}

			if (requestSchemaAsts.length === 0) {
				// No request body or no content types
				const headersAst: ZodAST = {
					type: "object",
					properties: {},
					required: []
				}
				const requestSchemaAst: ZodAST = {
					type: "object",
					properties: {
						method: { type: "literal", value: method },
						path: pathSchemaAst,
						query: querySchemaAst,
						headers: headersAst,
						body: { type: "undefined" }
					},
					required: ["method", "path", "query", "headers", "body"],
					description: `${method.toUpperCase()} request for ${pathKey}`
				}
				requestSchemaAsts.push(requestSchemaAst)
				requestContentTypes.push(null)
			}

			// Generate response schemas corresponding to each request schema
			const responses = operation.responses || {}
			for (let i = 0; i < requestSchemaAsts.length; i++) {
				const requestContentType = requestContentTypes[i]
				const branches: ZodAST[] = []

				for (const [status, response] of Object.entries(responses)) {
					const resolvedResponse = response.$ref
						? resolveRef(openapi, response.$ref)
						: response
					let statusAst: ZodAST
					if (/^\d+$/.test(status)) {
						statusAst = { type: "literal", value: Number.parseInt(status, 10) }
					} else {
						statusAst = { type: "number" }
					}

					if (resolvedResponse.content) {
						// For status 200, prioritize the matching content type if available
						if (
							status === "200" &&
							requestContentType &&
							resolvedResponse.content[requestContentType]
						) {
							const mediaType = resolvedResponse.content[requestContentType]
							const headersAst = getHeadersSchemaAst(
								resolvedResponse,
								requestContentType,
								openapi,
								getSchemaVariable
							)
							const bodyAst = mediaType.schema
								? openApiSchemaToZodAst(
										mediaType.schema,
										getSchemaVariable,
										openapi
									)
								: { type: "undefined" as const }
							branches.push({
								type: "object",
								properties: {
									status: statusAst,
									headers: headersAst,
									body: bodyAst
								},
								required: ["status", "headers", "body"]
							})
						} else {
							// For other statuses or if no matching content type, include all content types
							for (const [respContentType, mediaType] of Object.entries(
								resolvedResponse.content
							)) {
								const headersAst = getHeadersSchemaAst(
									resolvedResponse,
									respContentType,
									openapi,
									getSchemaVariable
								)
								const bodyAst = mediaType.schema
									? openApiSchemaToZodAst(
											mediaType.schema,
											getSchemaVariable,
											openapi
										)
									: { type: "undefined" as const }
								branches.push({
									type: "object",
									properties: {
										status: statusAst,
										headers: headersAst,
										body: bodyAst
									},
									required: ["status", "headers", "body"]
								})
							}
						}
					} else {
						const headersAst = getHeadersSchemaAst(
							resolvedResponse,
							null,
							openapi,
							getSchemaVariable
						)
						branches.push({
							type: "object",
							properties: {
								status: statusAst,
								headers: headersAst,
								body: { type: "undefined" as const }
							},
							required: ["status", "headers", "body"]
						})
					}
				}

				if (branches.length > 1) {
					const unionAst: ZodAST = {
						type: "union",
						options: branches,
						description: `Responses for ${method.toUpperCase()} ${pathKey} with request content type ${requestContentType || "no body"}`
					}
					responseSchemaCodes.push(generateZodCode(unionAst))
				} else if (branches.length === 1) {
					responseSchemaCodes.push(generateZodCode(branches[0]))
				} else {
					throw new Error(`No responses defined for ${method} ${pathKey}`)
				}

				// Generate Zod code for the request schema
				requestSchemaCodes.push(generateZodCode(requestSchemaAsts[i]))
			}
		}
	}

	return `
import { z } from "zod";

${schemaDefs.join("\n\n")}

export const requestSchemas = [
${requestSchemaCodes.map((code) => `  ${code}`).join(",\n")}
];

export const responseSchemas = [
${responseSchemaCodes.map((code) => `  ${code}`).join(",\n")}
];
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

		// Remove unused variables before writing to file
		const cleanedCode = removeUnusedVariablesFromCode(zodCode)
		fs.writeFileSync(path.resolve(outputFile), cleanedCode)
		console.log(`Zod schemas written to ${outputFile}`)
	} catch (error) {
		console.error("Error:", (error as Error).message)
		process.exit(1)
	}
}
