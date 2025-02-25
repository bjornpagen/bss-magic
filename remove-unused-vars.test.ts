import { test, expect } from "bun:test"
import * as fs from "node:fs"
import * as path from "node:path"
import {
	removeUnusedVariables,
	removeUnusedVariablesFromCode
} from "./remove-unused-vars"

const TEST_DIR = path.join(process.cwd(), "test-temp")

if (!fs.existsSync(TEST_DIR)) {
	fs.mkdirSync(TEST_DIR, { recursive: true })
}

test("removeUnusedVariablesFromCode removes unused variables", () => {
	const code = "const unused = 123;\nconst used = 456;\nconsole.log(used);"
	const result = removeUnusedVariablesFromCode(code)

	expect(result).not.toMatch(/unused/)
	expect(result).toMatch(/used/)
})

test("removeUnusedVariablesFromCode keeps all used variables", () => {
	const code = "const a = 1;\nconst b = 2;\nconsole.log(a, b);"
	const result = removeUnusedVariablesFromCode(code)

	expect(result).toMatch(/a\s*=\s*1/)
	expect(result).toMatch(/b\s*=\s*2/)
})

test("removeUnusedVariablesFromCode handles multi-variable declarations", () => {
	const code = "const a = 1, b = 2, c = 3;\nconsole.log(a);"
	const result = removeUnusedVariablesFromCode(code)

	expect(result).toMatch(/a\s*=\s*1/)
	expect(result).not.toMatch(/b\s*=\s*2/)
	expect(result).not.toMatch(/c\s*=\s*3/)
})

test("removeUnusedVariablesFromCode removes entire declaration when all variables are unused", () => {
	const code = `const a = 1, b = 2;\nconst c = 3;\nconsole.log("Hello");`
	const result = removeUnusedVariablesFromCode(code)

	expect(result).not.toMatch(/a\s*=\s*1/)
	expect(result).not.toMatch(/b\s*=\s*2/)
	expect(result).not.toMatch(/c\s*=\s*3/)
	expect(result).toMatch(/console\.log\("Hello"\)/)
})

test("removeUnusedVariablesFromCode handles different variable declaration types", () => {
	const code = `
let a = 1;
let b = 2;
var c = 3;
var d = 4;
console.log(a, c);
  `
	const result = removeUnusedVariablesFromCode(code)

	expect(result).toMatch(/let\s+a\s*=\s*1/)
	expect(result).not.toMatch(/let\s+b\s*=\s*2/)
	expect(result).toMatch(/var\s+c\s*=\s*3/)
	expect(result).not.toMatch(/var\s+d\s*=\s*4/)
})

test("removeUnusedVariables correctly processes files", () => {
	const inputPath = path.join(TEST_DIR, "input.ts")
	const outputPath = path.join(TEST_DIR, "output.ts")
	const code = "const unused = 123;\nconst used = 456;\nconsole.log(used);"

	fs.writeFileSync(inputPath, code)
	removeUnusedVariables(inputPath, outputPath)

	const result = fs.readFileSync(outputPath, "utf-8")

	expect(result).not.toMatch(/unused/)
	expect(result).toMatch(/used/)

	fs.unlinkSync(inputPath)
	fs.unlinkSync(outputPath)
})

test("throws error for invalid input in removeUnusedVariablesFromCode", () => {
	expect(() => removeUnusedVariablesFromCode("const =;")).toThrow()
})

test("throws error for non-existent file in removeUnusedVariables", () => {
	const nonExistentFile = path.join(TEST_DIR, "non-existent.ts")
	const outputPath = path.join(TEST_DIR, "output.ts")

	expect(() => removeUnusedVariables(nonExistentFile, outputPath)).toThrow()
})

test("cleanup test directory", () => {
	if (fs.existsSync(TEST_DIR)) {
		fs.rmdirSync(TEST_DIR)
	}
	expect(fs.existsSync(TEST_DIR)).toBe(false)
})
