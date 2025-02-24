import { test, expect } from "bun:test"
import { parseOpenAPISpec } from "./parse"
import type { OpenAPIOperation, OpenAPIResponse } from "./parse"
import SwaggerParser from "@apidevtools/swagger-parser"

const SPEC_PATH = "./vendor/openapi/TMF666-Account_Management-v5.0.0.oas.yaml"

test("parse returns non-empty paths", () => {
	const result = parseOpenAPISpec(SPEC_PATH)
	expect(Object.keys(result).length).toBeGreaterThan(0)
})

test("each parsed spec is a valid OpenAPI document", () => {
	const result = parseOpenAPISpec(SPEC_PATH)
	for (const path of Object.keys(result)) {
		const spec = result[path]
		// @ts-expect-error SwaggerParser expects a swagger property, but this is an OpenAPI3 spec
		expect(SwaggerParser.validate(spec)).resolves.toBeDefined()
	}
})

test("parsed spec contains all expected endpoints", () => {
	const result = parseOpenAPISpec(SPEC_PATH)
	const expectedPaths = [
		"/partyAccount",
		"/billFormat",
		"/billingAccount",
		"/settlementAccount",
		"/financialAccount",
		"/billPresentationMedia",
		"/billingCycleSpecification"
	]

	for (const path of expectedPaths) {
		expect(result[path]).toBeDefined()
	}
})

test("each path spec contains required OpenAPI fields", () => {
	const result = parseOpenAPISpec(SPEC_PATH)

	for (const pathSpec of Object.values(result)) {
		expect(pathSpec.openapi).toBe("3.0.1")
		expect(pathSpec.info.title).toBe("Account Management")
		expect(pathSpec.info.version).toBe("5.0.0")
		expect(pathSpec.servers).toBeDefined()
		expect(pathSpec.servers?.[0].url).toBe("https://serverRoot")
	}
})

test("path specs include referenced components", () => {
	const result = parseOpenAPISpec(SPEC_PATH)

	for (const pathSpec of Object.values(result)) {
		const paths = pathSpec.paths
		for (const path of Object.values(paths)) {
			const operations = ["get", "post", "put", "delete"] as const
			for (const op of operations) {
				const operation = path[op] as OpenAPIOperation
				if (!operation) {
					continue
				}

				if (operation.parameters) {
					for (const param of operation.parameters) {
						if (param.$ref) {
							const refParts = (param.$ref as string).split("/")
							const componentType = refParts[2]
							const componentName = refParts[3]
							expect(
								pathSpec.components?.[componentType]?.[componentName]
							).toBeDefined()
						}
					}
				}

				if (operation.responses) {
					for (const response of Object.values(operation.responses)) {
						const typedResponse = response as OpenAPIResponse
						if ("$ref" in typedResponse && typedResponse.$ref) {
							const refParts = typedResponse.$ref.split("/")
							const componentType = refParts[2]
							const componentName = refParts[3]
							expect(
								pathSpec.components?.[componentType]?.[componentName]
							).toBeDefined()
						}
					}
				}
			}
		}
	}
})

test("path specs include required security schemes", () => {
	const result = parseOpenAPISpec(SPEC_PATH)

	for (const pathSpec of Object.values(result)) {
		const paths = pathSpec.paths
		for (const path of Object.values(paths)) {
			const operations = ["get", "post", "put", "delete"] as const
			for (const op of operations) {
				const operation = path[op] as OpenAPIOperation
				if (!operation?.security) {
					continue
				}

				for (const securityReq of operation.security) {
					for (const schemeName of Object.keys(securityReq)) {
						expect(
							pathSpec.components?.securitySchemes?.[schemeName]
						).toBeDefined()
					}
				}
			}
		}
	}
})

test("path specs maintain operation metadata", () => {
	const result = parseOpenAPISpec(SPEC_PATH)

	for (const [pathUrl, pathSpec] of Object.entries(result)) {
		const path = pathSpec.paths[pathUrl]
		const operations = ["get", "post", "put", "delete"] as const

		for (const op of operations) {
			const operation = path[op] as OpenAPIOperation
			if (!operation) {
				continue
			}

			expect(operation.summary).toBeDefined()
			if (operation.parameters) {
				expect(Array.isArray(operation.parameters)).toBe(true)
			}
			expect(operation.responses).toBeDefined()
		}
	}
})

test("throws error for invalid YAML file", () => {
	expect(() => parseOpenAPISpec("nonexistent.yaml")).toThrow()
})

test("throws error for invalid OpenAPI spec", () => {
	expect(() => parseOpenAPISpec(__filename)).toThrow()
})
