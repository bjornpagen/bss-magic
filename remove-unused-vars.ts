import * as fs from "node:fs"
import { transformSync } from "@babel/core"
import type { NodePath } from "@babel/traverse"
import type * as t from "@babel/types"
// @ts-ignore: can't find the type package for this import
import presetTypeScript from "@babel/preset-typescript"

// Custom Babel plugin to remove unused variables
function removeUnusedVariablesPlugin() {
	return {
		visitor: {
			VariableDeclaration(path: NodePath<t.VariableDeclaration>) {
				const declarators = path.node.declarations
				const unusedDeclarators = []

				// Check each declarator in the variable declaration
				for (let i = 0; i < declarators.length; i++) {
					const declarator = declarators[i]
					if (declarator.id.type === "Identifier") {
						const binding = path.scope.getBinding(declarator.id.name)
						// If the variable has no references, mark it for removal
						if (binding && binding.referencePaths.length === 0) {
							unusedDeclarators.push(i)
						}
					}
				}

				// If all declarators are unused, remove the entire declaration
				if (unusedDeclarators.length === declarators.length) {
					path.remove()
				}
				// Otherwise, remove only the unused declarators
				else if (unusedDeclarators.length > 0) {
					for (let i = unusedDeclarators.length - 1; i >= 0; i--) {
						const index = unusedDeclarators[i]
						declarators.splice(index, 1)
					}
					// If no declarators remain, remove the declaration
					if (declarators.length === 0) {
						path.remove()
					}
				}
			}
		}
	}
}

/**
 * Removes unused variables from a TypeScript file and writes the result to a new file.
 * @param inputFile Path to the input TypeScript file.
 * @param outputFile Path to the output file where modified code will be written.
 */
export function removeUnusedVariables(
	inputFile: string,
	outputFile: string
): void {
	const code = fs.readFileSync(inputFile, "utf-8")
	const transformedCode = removeUnusedVariablesFromCode(code)
	fs.writeFileSync(outputFile, transformedCode)
}

/**
 * Removes unused variables from a TypeScript code string and returns the modified code.
 * @param code The TypeScript code as a string.
 * @returns The modified code with unused variables removed.
 */
export function removeUnusedVariablesFromCode(code: string): string {
	const result = transformSync(code, {
		presets: [presetTypeScript],
		plugins: [removeUnusedVariablesPlugin],
		filename: "input.ts" // Helps Babel recognize the file as TypeScript
	})
	if (!result || !result.code) {
		throw new Error("Failed to transform code with Babel")
	}
	return result.code
}
