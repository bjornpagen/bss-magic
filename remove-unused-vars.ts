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
			Program(path: NodePath<t.Program>) {
				const lazyReferences = new Set<string>()
				const exportedNames = new Set<string>()

				// First pass: collect all lazy references and exports
				path.traverse({
					// Find all lazy references like z.lazy(() => schemaName)
					CallExpression(callPath) {
						const callee = callPath.node.callee
						if (
							callee.type === "MemberExpression" &&
							callee.property.type === "Identifier" &&
							callee.property.name === "lazy"
						) {
							const arg = callPath.node.arguments[0]
							if (
								arg &&
								arg.type === "ArrowFunctionExpression" &&
								arg.body.type === "CallExpression" &&
								arg.body.callee.type === "Identifier"
							) {
								lazyReferences.add(arg.body.callee.name)
							}
						}
					},

					// Collect export references
					ExportNamedDeclaration(exportPath) {
						if (exportPath.node.declaration?.type === "VariableDeclaration") {
							for (const declarator of exportPath.node.declaration
								.declarations) {
								if (declarator.id.type === "Identifier") {
									exportedNames.add(declarator.id.name)
								}
							}
						}
					},

					// Handle array expressions in exports that might reference schemas
					ArrayExpression(arrayPath) {
						if (
							arrayPath.parent.type === "VariableDeclarator" &&
							arrayPath.parentPath.parent.type === "VariableDeclaration"
						) {
							const declaration = arrayPath.parentPath.parent
							if (declaration.type === "VariableDeclaration") {
								const declarator = arrayPath.parent
								if (declarator.id.type === "Identifier") {
									// Check if this array is exported
									const varName = declarator.id.name
									const isExported = path.scope
										.getBinding(varName)
										?.referencePaths.some((refPath) => {
											let current = refPath
											while (current.parentPath) {
												if (
													current.isExportNamedDeclaration() ||
													current.isExportDefaultDeclaration()
												) {
													return true
												}
												current = current.parentPath
											}
											return false
										})

									if (isExported) {
										// This array is part of an export, check for references to schemas inside
										for (const element of arrayPath.node.elements) {
											if (
												element?.type === "CallExpression" &&
												element.callee.type === "MemberExpression" &&
												element.callee.object.type === "Identifier" &&
												element.callee.object.name === "z"
											) {
												// This is a zod schema reference - it might use other schemas
												for (const arg of element.arguments) {
													if (arg.type === "Identifier") {
														lazyReferences.add(arg.name)
													}
												}
											}
										}
									}
								}
							}
						}
					}
				})

				// Second pass: handle variable declarations and check for unused variables
				path.traverse({
					VariableDeclaration(varPath) {
						if (varPath.parent.type === "ExportNamedDeclaration") {
							return // Skip directly exported variables
						}

						const declarators = varPath.node.declarations
						const unusedDeclarators = []

						// Check each declarator in the variable declaration
						for (let i = 0; i < declarators.length; i++) {
							const declarator = declarators[i]
							if (declarator.id.type === "Identifier") {
								const varName = declarator.id.name
								const binding = varPath.scope.getBinding(varName)

								// Variable is used if it has references, is a lazy reference, or is exported
								const isUsed =
									(binding && binding.referencePaths.length > 0) ||
									lazyReferences.has(varName) ||
									exportedNames.has(varName)

								if (!isUsed) {
									unusedDeclarators.push(i)
								}
							}
						}

						// If all declarators are unused, remove the entire declaration
						if (unusedDeclarators.length === declarators.length) {
							varPath.remove()
						}
						// Otherwise, remove only the unused declarators
						else if (unusedDeclarators.length > 0) {
							for (let i = unusedDeclarators.length - 1; i >= 0; i--) {
								const index = unusedDeclarators[i]
								declarators.splice(index, 1)
							}
							// If no declarators remain, remove the declaration
							if (declarators.length === 0) {
								varPath.remove()
							}
						}
					}
				})
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
		filename: "input.ts", // Helps Babel recognize the file as TypeScript
		parserOpts: {
			plugins: ["typescript"]
		}
	})
	if (!result || !result.code) {
		throw new Error("Failed to transform code with Babel")
	}
	return result.code
}
