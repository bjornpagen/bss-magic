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
				content?: Record<
					string,
					{
						schema: OpenAPISchema
					}
				>
				headers?: Record<
					string,
					{
						$ref?: string
						schema?: OpenAPISchema
						required?: boolean
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
						headers?: Record<
							string,
							{
								$ref?: string
								schema?: OpenAPISchema
								required?: boolean
							}
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
	| { type: "any"; description?: string } // Added "any" type

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
	options: { coerce?: boolean; isHeader?: boolean } = {}
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
		return openApiSchemaToZodAst(resolvedSchema, refResolver, openapi, options)
	}

	if (schema.oneOf && schema.discriminator) {
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
						options
					)
					if (subAst.type === "object") {
						const extendedProperties = { ...subAst.properties }
						extendedProperties[discriminatorProp] = {
							type: "literal",
							value: typeValue
						}
						const extendedRequired = subAst.required.includes(discriminatorProp)
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
			} else {
				// Handle inline subschemas if needed
			}
		}
		return {
			type: "discriminatedUnion",
			discriminator: discriminatorProp,
			options: unionOptions,
			description: schema.description
		}
	}

	if (schema.allOf) {
		const properties: Record<string, ZodAST> = {}
		const required: Set<string> = new Set(schema.required || [])

		for (const subSchema of schema.allOf) {
			const subAst = openApiSchemaToZodAst(
				subSchema,
				refResolver,
				openapi,
				options
			)
			if (subAst.type === "object") {
				for (const [propName, propAst] of Object.entries(subAst.properties)) {
					properties[propName] = propAst
				}
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
					options
				)
				if (resolvedAst.type === "object") {
					for (const [propName, propAst] of Object.entries(
						resolvedAst.properties
					)) {
						properties[propName] = propAst
					}
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
		const schemaProperties = schema.properties || {}
		for (const [propName, propSchema] of Object.entries(
			schemaProperties as Record<string, OpenAPISchema>
		)) {
			properties[propName] = openApiSchemaToZodAst(
				propSchema,
				refResolver,
				openapi,
				options
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
			const properties: Record<string, ZodAST> = {}
			const required = schema.required || []
			const schemaProperties = schema.properties || {}
			for (const [propName, propSchema] of Object.entries(
				schemaProperties as Record<string, OpenAPISchema>
			)) {
				properties[propName] = openApiSchemaToZodAst(
					propSchema,
					refResolver,
					openapi,
					options
				)
			}
			ast = {
				type: "object",
				properties,
				required,
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
			if (options.coerce || options.isHeader) {
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
				options
			)
			ast = { type: "array", items: itemsAst, description: schema.description }
			break
		}
		default:
			ast = { type: "any", description: schema.description } // Changed to "any"
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
			return `z.lazy(() => ${ast.ref})`
		case "literal": {
			let code = `z.literal(${JSON.stringify(ast.value)})`
			if (ast.description) {
				code += `.describe(${JSON.stringify(ast.description)})`
			}
			return code
		}
		case "merge": {
			if (ast.schemas.length === 0) {
				throw new Error("Merge must have at least one schema")
			}
			let code = generateZodCode(ast.schemas[0])
			for (let i = 1; i < ast.schemas.length; i++) {
				code = `${code}.merge(${generateZodCode(ast.schemas[i])})`
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
		case "discriminatedUnion": {
			const optionsCode = ast.options
				.map((option) => generateZodCode(option))
				.join(", ")
			let code = `z.discriminatedUnion(${JSON.stringify(ast.discriminator)}, [${optionsCode}])`
			if (ast.description) {
				code += `.describe(${JSON.stringify(ast.description)})`
			}
			return code
		}
		case "coerce": {
			if (ast.schema.type === "number") {
				let code = "z.coerce.number()"
				if (ast.description) {
					code += `.describe(${JSON.stringify(ast.description)})`
				}
				return code
			}
			if (ast.schema.type === "boolean") {
				let code = "z.coerce.boolean()"
				if (ast.description) {
					code += `.describe(${JSON.stringify(ast.description)})`
				}
				return code
			}
			throw new Error("Coercion only supported for number and boolean schemas")
		}
		case "datetime": {
			let code = "z.string().datetime()"
			if (ast.description) {
				code += `.describe(${JSON.stringify(ast.description)})`
			}
			return code
		}
		case "any": {
			// Added case for "any"
			let code = "z.any()"
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
			refResolver,
			openapi
		)
	}
	return { type: "undefined" }
}

/** Checks if an object is a valid header definition with a schema property */
function isHeaderDefinition(
	obj: unknown
): obj is { schema?: OpenAPISchema; required?: boolean } {
	return typeof obj === "object" && obj !== null && "schema" in obj
}

/** Gets the Zod AST for a response's headers schema */
function getHeadersSchemaAst(
	response: OpenAPISchema & {
		headers?: Record<
			string,
			{
				$ref?: string
				schema?: OpenAPISchema
				required?: boolean
			}
		>
	},
	openapi: OpenAPISchema,
	refResolver: (ref: string) => string
): ZodAST {
	if (response.$ref) {
		const resolvedResponse = resolveRef(openapi, response.$ref)
		return getHeadersSchemaAst(resolvedResponse, openapi, refResolver)
	}
	const headers = response.headers || {}
	const properties: Record<string, ZodAST> = {}
	const requiredHeaders: string[] = []
	for (const [headerName, headerDef] of Object.entries(headers)) {
		let headerSchema: OpenAPISchema = {}

		if (headerDef.$ref) {
			const resolvedHeader = resolveRef(openapi, headerDef.$ref)

			if (isHeaderDefinition(resolvedHeader)) {
				headerSchema = resolvedHeader.schema || {}
			} else {
				console.warn(
					`Resolved header reference ${headerDef.$ref} does not have expected schema structure`
				)
			}
		} else {
			headerSchema = headerDef.schema || {}
		}

		const headerAst = openApiSchemaToZodAst(
			headerSchema,
			refResolver,
			openapi,
			{
				isHeader: true
			}
		)
		properties[headerName] = headerAst
		if (headerDef.required) {
			requiredHeaders.push(headerName)
		}
	}
	return {
		type: "object",
		properties,
		required: requiredHeaders,
		description: "Response headers"
	}
}

/** Generates the request schema for a specific operation */
function generateRequestSchema(
	method: string,
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
			required?: boolean
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

	// Process parameters, resolving any references
	const rawParams = operation.parameters || []
	const params: Parameter[] = rawParams.map((param) => {
		if (param.$ref) {
			return resolveRef(openapi, param.$ref) as Parameter
		}
		return param
	})

	const pathParams = params.filter((p: Parameter) => p.in === "path")
	const queryParams = params.filter((p: Parameter) => p.in === "query")

	const pathSchemaAst: ZodAST = {
		type: "object",
		properties: {},
		required: []
	}
	for (const param of pathParams) {
		if (!param.schema) {
			throw new Error(`Parameter ${param.name} has no schema`)
		}
		const paramAst = openApiSchemaToZodAst(param.schema, refResolver, openapi)
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
		const paramAst = openApiSchemaToZodAst(param.schema, refResolver, openapi, {
			coerce: true
		})
		if (param.description) {
			paramAst.description = param.description
		}
		querySchemaAst.properties[param.name] = paramAst
		if (param.required) {
			querySchemaAst.required.push(param.name)
		}
	}

	let bodyAst: ZodAST = { type: "undefined" }
	let isBodyRequired = false
	if (operation.requestBody) {
		let requestBody: {
			$ref?: string
			content?: Record<string, { schema: OpenAPISchema }>
			required?: boolean
		} = operation.requestBody
		if (requestBody.$ref) {
			const resolved = resolveRef(openapi, requestBody.$ref)
			requestBody = resolved as {
				$ref?: string
				content?: Record<string, { schema: OpenAPISchema }>
				required?: boolean
			}
		}
		if (requestBody.content?.["application/json"]?.schema) {
			bodyAst = openApiSchemaToZodAst(
				requestBody.content["application/json"].schema,
				refResolver,
				openapi
			)
			isBodyRequired = requestBody.required ?? false
		}
	}

	// Generate Zod code for path, query, and body with coercion to empty object
	let pathCode = generateZodCode(pathSchemaAst)
	if (Object.keys(pathSchemaAst.properties).length === 0) {
		pathCode = `${pathCode}.optional().default({})`
	}

	let queryCode = generateZodCode(querySchemaAst)
	if (Object.keys(querySchemaAst.properties).length === 0) {
		queryCode = `${queryCode}.optional().default({})`
	}

	let bodyCode = generateZodCode(bodyAst)
	if (!isBodyRequired) {
		bodyCode = `${bodyCode}.optional()`
	}

	const requestSchemaCode = `z.object({
    method: z.literal(${JSON.stringify(method)}),
    path: ${pathCode},
    query: ${queryCode},
    body: ${bodyCode},
  })`

	return requestSchemaCode
}

/** Transforms an OpenAPI schema to Zod TypeScript code for all operations */
function transformOpenApiToZod(openapi: OpenAPISchema): string {
	const paths = openapi.paths || {}
	const schemaDefs: string[] = []
	const requestDefs: string[] = []
	const responseDefs: string[] = []

	// Generate all schema definitions from components
	const schemas = openapi.components?.schemas || {}
	for (const [schemaName, schema] of Object.entries(schemas)) {
		const variableName = getSchemaVariable(`#/components/schemas/${schemaName}`)
		const ast = openApiSchemaToZodAst(schema, getSchemaVariable, openapi)
		const code = generateZodCode(ast)
		schemaDefs.push(`const ${variableName} = ${code};`)
	}

	// Iterate over each path and method
	for (const [_pathKey, pathOperations] of Object.entries(paths)) {
		for (const [method, operation] of Object.entries(pathOperations)) {
			const _methodName = method.toUpperCase()
			const requestVariable = `${method.toLowerCase()}RequestSchema`
			const responseVariable = `${method.toLowerCase()}ResponseSchema`

			// Generate request schema
			const requestCode = generateRequestSchema(
				method,
				operation,
				openapi,
				getSchemaVariable
			)
			requestDefs.push(`export const ${requestVariable} = ${requestCode};`)

			// Generate response schemas
			const responses = operation.responses || {}
			const branches: string[] = []
			for (const [status, response] of Object.entries(responses)) {
				const resolvedResponse = response.$ref
					? resolveRef(openapi, response.$ref)
					: response
				const bodySchemaAst = getResponseSchema(
					resolvedResponse,
					openapi,
					getSchemaVariable
				)
				const headersSchemaAst = getHeadersSchemaAst(
					resolvedResponse,
					openapi,
					getSchemaVariable
				)
				const bodySchemaCode = generateZodCode(bodySchemaAst)
				const headersSchemaCode = generateZodCode(headersSchemaAst)
				if (/^\d+$/.test(status)) {
					const statusNumber = Number.parseInt(status, 10)
					branches.push(
						`z.object({ status: z.literal(${statusNumber}), headers: ${headersSchemaCode}, body: ${bodySchemaCode} })`
					)
				} else {
					// Handle default or other status codes if necessary
				}
			}
			const responseSchemaCode = `export const ${responseVariable} = z.union([${branches.join(
				", "
			)}])`
			responseDefs.push(responseSchemaCode)
		}
	}

	return `
import { z } from "zod";

${schemaDefs.join("\n\n")}

${requestDefs.join("\n\n")}

${responseDefs.join("\n\n")}
    `.trim()
}

// ### Exports and CLI

export { transformOpenApiToZod }

if (require.main === module) {
	const args = process.argv.slice(2)
	if (args.length !== 2) {
		console.error(
			"Usage: ts-nodescript.ts <input-openapi.json> <output-zod.ts>"
		)
		process.exit(1)
	}
	const [inputFile, outputFile] = args
	try {
		const openapiJson = fs.readFileSync(path.resolve(inputFile), "utf-8")
		const openapi = JSON.parse(openapiJson) as OpenAPISchema
		const zodCode = transformOpenApiToZod(openapi)
		// Remove unused variables before writing to file
		const cleanedZodCode = removeUnusedVariablesFromCode(zodCode)
		fs.writeFileSync(path.resolve(outputFile), cleanedZodCode)
		console.log(
			`Zod schemas with unused variables removed written to ${outputFile}`
		)
	} catch (error) {
		console.error("Error:", (error as Error).message)
		process.exit(1)
	}
}
