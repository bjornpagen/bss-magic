import * as fs from "node:fs"
import * as path from "node:path"
import { parseOpenAPISpec } from "./parse"

const yamlFile = "./vendor/openapi/TMF666-Account_Management-v5.0.0.oas.yaml"
const result = parseOpenAPISpec(yamlFile)

const outputDir = "./generated/tmf666"
fs.mkdirSync(outputDir, { recursive: true })

for (const [pathName, spec] of Object.entries(result)) {
	const sanitizedPath = pathName.replace(/\//g, "_").replace(/^_/, "")
	const outputPath = path.join(outputDir, `${sanitizedPath}.json`)
	fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2))
}

console.log(`Generated OpenAPI specs in ${outputDir}`)
