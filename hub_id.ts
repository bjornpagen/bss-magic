import { z } from "zod"

const extensibleSchema = z
	.object({
		"@type": z
			.string()
			.describe(
				"When sub-classing, this defines the sub-class Extensible name"
			),
		"@baseType": z
			.string()
			.describe("When sub-classing, this defines the super-class")
			.optional(),
		"@schemaLocation": z
			.string()
			.describe(
				"A URI to a JSON-Schema file that defines additional attributes and relationships"
			)
			.optional()
	})
	.describe(
		"Base Extensible schema for use in TMForum Open-APIs - When used for in a schema it means that the Entity described by the schema  MUST be extended with the @type"
	)

const errorSchema = extensibleSchema
	.extend({
		code: z
			.string()
			.describe(
				"Application relevant detail, defined in the API or a common list."
			),
		reason: z
			.string()
			.describe(
				"Explanation of the reason for the error which can be shown to a client user."
			),
		message: z
			.string()
			.describe(
				"More details and corrective actions related to the error which can be shown to a client user."
			)
			.optional(),
		status: z.string().describe("HTTP Error code extension").optional(),
		referenceError: z
			.string()
			.describe("URI of documentation describing the error.")
			.optional()
	})
	.describe(
		"Used when an API throws an Error, typically with a HTTP error response-code (3xx, 4xx, 5xx)"
	)

export const responseSchema = z.union([
	z.object({ status: z.literal(204), body: z.undefined() }),
	z.object({ status: z.number(), body: errorSchema })
])

export const requestSchema = z.object({
	path: z.object({ id: z.string() }),
	query: z.object({}),
	body: z.undefined()
})
