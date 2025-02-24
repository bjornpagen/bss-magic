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
	| { type: "undefined"; description?: string } // Added for z.undefined()

// ### Utility Functions

/**
 * Converts an OpenAPI schema to a Zod AST
 * @param schema OpenAPI schema to transform
 * @param refResolver Function to resolve $ref references to variable names
 * @returns ZodAST representation of the schema
 */
function openApiSchemaToZodAst(
	schema: OpenAPISchema,
	refResolver: (ref: string) => string
): ZodAST {
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
			schema.allOf[1].type === "object"
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
			for (const [propName, propSchema] of Object.entries(
				schema.properties || {}
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

/**
 * Generates TypeScript code using Zod from a Zod AST
 * @param ast Zod AST to convert to code
 * @returns String of TypeScript code
 */
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
				description?: string
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

/**
 * Resolves an OpenAPI $ref to a variable name
 * @param ref Reference string (e.g., '#/components/schemas/Error')
 * @returns Variable name (e.g., 'errorSchema')
 */
function getSchemaVariable(ref: string): string {
	const parts = ref.split("/")
	const schemaName = parts[parts.length - 1]
	if (!schemaName) {
		throw new Error(`Invalid schema reference: ${ref}`)
	}
	return `${schemaName[0].toLowerCase()}${schemaName.slice(1)}Schema`
}

/**
 * Generates Zod schema definitions for all components.schemas in the correct order
 * @param openapi OpenAPI schema object
 * @returns Array of schema definition strings
 */
function generateSchemaDefinitions(openapi: OpenAPISchema): string[] {
	const definitions: string[] = []
	const schemas = openapi.components?.schemas || {}

	// Define schemas in dependency order: Extensible before Error
	const orderedSchemaNames = ["Extensible", "Error"]

	for (const schemaName of orderedSchemaNames) {
		const schema = schemas[schemaName]
		if (!schema) {
			continue // Skip if schema doesn't exist
		}
		const variableName = getSchemaVariable(`#/components/schemas/${schemaName}`)
		const ast = openApiSchemaToZodAst(schema, getSchemaVariable)
		const code = generateZodCode(ast)
		definitions.push(`const ${variableName} = ${code};`)
	}

	return definitions
}

/**
 * Generates the response schemas for DELETE /hub/{id}
 * @param openapi OpenAPI schema object
 * @returns Array of response schema definition strings
 */
function generateResponseSchemas(openapi: OpenAPISchema): string[] {
	const errorSchemaRef =
		openapi.components?.responses?.Error?.content?.["application/json"]?.schema
			?.$ref
	if (!errorSchemaRef) {
		throw new Error(
			"Missing or invalid error schema reference in responses.Error"
		)
	}
	const errorSchemaVar = getSchemaVariable(errorSchemaRef)

	const successResponseAst: ZodAST = {
		type: "object",
		properties: { status: { type: "literal", value: "success" } },
		required: ["status"],
		description: "Deleted"
	}
	const successCode = `const successResponseSchema = ${generateZodCode(
		successResponseAst
	)};`

	const errorResponseAst: ZodAST = {
		type: "object",
		properties: {
			status: { type: "literal", value: "error" },
			error: { type: "reference", ref: errorSchemaVar }
		},
		required: ["status", "error"]
	}
	const errorResponseCode = `const errorResponseSchema = ${generateZodCode(
		errorResponseAst
	)};`

	const responseCode = `export const responseSchema = z.discriminatedUnion("status", [successResponseSchema, errorResponseSchema]).describe("Response for DELETE /hub/{id}");`

	return [successCode, errorResponseCode, responseCode]
}

/**
 * Transforms an OpenAPI schema to Zod TypeScript code
 * @param openapi OpenAPI schema object
 * @returns Formatted TypeScript code string
 */
function transformOpenApiToZod(openapi: OpenAPISchema): string {
	// Generate base schema definitions in the correct order
	const schemaDefs = generateSchemaDefinitions(openapi)

	// Generate response schemas
	const responseDefs = generateResponseSchemas(openapi)

	// Define request schema AST
	const requestAst: ZodAST = {
		type: "object",
		properties: {
			params: {
				type: "object",
				properties: {
					id: { type: "string", description: "Identifier of the Resource" }
				},
				required: ["id"]
			},
			body: { type: "undefined" }
		},
		required: ["params", "body"],
		description: "Request schema for DELETE /hub/{id}"
	}
	const requestCode = `export const requestSchema = ${generateZodCode(requestAst)};`

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
