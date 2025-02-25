import * as fs from "node:fs"
import * as path from "node:path"
import { safariHeaders } from "./safari"

/**
 * Fetches the content of a URL using Safari headers
 */
async function fetchWithSafari(url: string): Promise<Response> {
	return fetch(url, {
		headers: safariHeaders,
		redirect: "follow"
	})
}

/**
 * Extracts text content from HTML
 */
function extractTextFromHtml(html: string): string {
	// Remove scripts
	let text = html.replace(
		/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
		" "
	)
	// Remove styles
	text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
	// Replace HTML tags with spaces
	text = text.replace(/<[^>]*>/g, " ")
	// Replace multiple spaces with a single space
	text = text.replace(/\s+/g, " ")
	// Decode HTML entities
	text = text
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#039;/g, "'")
		.replace(/&nbsp;/g, " ")

	return text.trim()
}

/**
 * Fetches the raw HTML of the Totogi API docs website
 */
async function fetchRawHtml(
	url = "https://docs.api.totogi.com"
): Promise<string> {
	try {
		const response = await fetchWithSafari(url)

		if (!response.ok) {
			throw new Error(
				`Failed to fetch ${url}: ${response.status} ${response.statusText}`
			)
		}

		return await response.text()
	} catch (error) {
		throw new Error(`Error fetching raw HTML: ${(error as Error).message}`)
	}
}

/**
 * Extracts sections from HTML based on section IDs
 */
function extractSections(html: string): { id: string; content: string }[] {
	const sections: { id: string; content: string }[] = []

	// Match all sections with IDs
	const sectionRegex = /<section\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g

	let match: RegExpExecArray | null

	// Get all section matches
	match = sectionRegex.exec(html)
	while (match !== null) {
		const id = match[1]
		const content = match[0] // The entire section content including the section tags
		sections.push({ id, content })
		match = sectionRegex.exec(html)
	}

	// Also capture definition sections
	const definitionRegex =
		/<div\s+id="([^"]+)"[^>]*class="[^"]*definition[^"]*"[^>]*>([\s\S]*?)<\/div>/g

	// Get all definition matches
	match = definitionRegex.exec(html)
	while (match !== null) {
		const id = match[1]
		const content = match[0] // The entire definition content
		sections.push({ id, content })
		match = definitionRegex.exec(html)
	}

	return sections
}

/**
 * Saves sections to separate files in a folder
 */
async function saveSectionsToFolder(
	sections: { id: string; content: string }[],
	folderPath: string
): Promise<void> {
	// Create the folder if it doesn't exist
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true })
	}

	// Save the index.html with links to all sections
	const indexContent = `<!DOCTYPE html>
<html>
<head>
	<title>Totogi API Documentation Index</title>
	<style>
		body { font-family: system-ui, -apple-system, sans-serif; }
		.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
		.section-list { column-count: 3; column-gap: 20px; }
		h1 { color: #333; }
		a { color: #0066cc; text-decoration: none; }
		a:hover { text-decoration: underline; }
	</style>
</head>
<body>
	<div class="container">
		<h1>Totogi API Documentation Sections</h1>
		<div class="section-list">
			${sections.map((section) => `<p><a href="./${section.id}.html">${section.id}</a></p>`).join("\n\t\t\t")}
		</div>
	</div>
</body>
</html>`

	fs.writeFileSync(path.join(folderPath, "index.html"), indexContent)
	console.log(`Created index file at ${path.join(folderPath, "index.html")}`)

	// Save a JSON index of all sections
	const jsonIndex = JSON.stringify(
		sections.map((s) => s.id),
		null,
		2
	)
	fs.writeFileSync(path.join(folderPath, "sections.json"), jsonIndex)

	// Save each section to a separate file
	let counter = 0
	for (const section of sections) {
		const filePath = path.join(folderPath, `${section.id}.html`)

		// Create a standalone HTML file for the section
		const sectionHtml = `<!DOCTYPE html>
<html>
<head>
	<title>${section.id} - Totogi API Documentation</title>
	<style>
		body { font-family: system-ui, -apple-system, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
		pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
		code { font-family: monospace; }
		a { color: #0066cc; }
		.back-link { margin-bottom: 20px; }
	</style>
</head>
<body>
	<div class="back-link"><a href="./index.html">← Back to Index</a></div>
	<h1>${section.id}</h1>
	${section.content}
</body>
</html>`

		fs.writeFileSync(filePath, sectionHtml)
		counter++
	}

	console.log(`Saved ${counter} sections to ${folderPath}`)
}

/**
 * Scrapes the Totogi API docs and splits the content into separate files by section
 */
async function scrapeTotogiDocsAndSplitSections(
	outputFolder = "totogi-docs",
	url = "https://docs.api.totogi.com"
): Promise<void> {
	try {
		console.log(`Fetching raw HTML from ${url}...`)
		const html = await fetchRawHtml(url)

		console.log("Extracting sections...")
		const sections = extractSections(html)
		console.log(`Found ${sections.length} sections`)

		console.log(`Saving sections to folder ${outputFolder}...`)
		await saveSectionsToFolder(sections, outputFolder)

		// Also save the full HTML for reference
		fs.writeFileSync(path.join(outputFolder, "full.html"), html)
		console.log(`Full HTML saved to ${path.join(outputFolder, "full.html")}`)
	} catch (error) {
		throw new Error(`Error processing HTML: ${(error as Error).message}`)
	}
}

/**
 * Scrapes the Totogi API docs website content
 */
async function scrapeTotogiDocs(
	url = "https://docs.api.totogi.com"
): Promise<string> {
	try {
		const response = await fetchWithSafari(url)

		if (!response.ok) {
			throw new Error(
				`Failed to fetch ${url}: ${response.status} ${response.statusText}`
			)
		}

		const html = await response.text()
		return extractTextFromHtml(html)
	} catch (error) {
		throw new Error(`Error scraping Totogi docs: ${(error as Error).message}`)
	}
}

/**
 * Saves the scraped content to a file
 */
async function saveScrapedContent(
	content: string,
	outputPath: string
): Promise<void> {
	try {
		fs.writeFileSync(path.resolve(outputPath), content)
		console.log(`Content saved to ${outputPath}`)
	} catch (error) {
		throw new Error(`Error saving content: ${(error as Error).message}`)
	}
}

/**
 * Scrapes all linked pages from the main documentation page and returns raw HTML
 */
async function scrapeAllPagesRawHtml(
	baseUrl = "https://docs.api.totogi.com"
): Promise<string> {
	try {
		const html = await fetchRawHtml(baseUrl)
		return html
	} catch (error) {
		throw new Error(`Error scraping raw HTML: ${(error as Error).message}`)
	}
}

/**
 * Scrapes all linked pages from the main documentation page
 */
async function scrapeAllPages(
	baseUrl = "https://docs.api.totogi.com"
): Promise<string> {
	try {
		const response = await fetchWithSafari(baseUrl)

		if (!response.ok) {
			throw new Error(
				`Failed to fetch ${baseUrl}: ${response.status} ${response.statusText}`
			)
		}

		const html = await response.text()

		// Extract all links from the page that point to other documentation pages
		const linkRegex = /href="([^"]+)"/g
		const matches = html.matchAll(linkRegex)
		const links = new Set<string>()

		for (const match of matches) {
			const link = match[1]
			if (link?.startsWith("/") && !link.includes("#")) {
				links.add(new URL(link, baseUrl).toString())
			} else if (
				link?.startsWith("http") &&
				link.includes("docs.api.totogi.com") &&
				!link.includes("#")
			) {
				links.add(link)
			}
		}

		// Scrape content from all unique links
		let allContent = extractTextFromHtml(html)

		for (const link of links) {
			try {
				console.log(`Scraping ${link}...`)
				const pageContent = await scrapeTotogiDocs(link)
				allContent += `\n\n${pageContent}`
			} catch (error) {
				console.error(`Error scraping ${link}: ${(error as Error).message}`)
			}
		}

		return allContent
	} catch (error) {
		throw new Error(`Error scraping all pages: ${(error as Error).message}`)
	}
}

// Exports
export {
	scrapeTotogiDocs,
	scrapeAllPages,
	fetchRawHtml,
	scrapeAllPagesRawHtml,
	saveScrapedContent,
	scrapeTotogiDocsAndSplitSections
}

// CLI
if (require.main === module) {
	const args = process.argv.slice(2)
	const outputFolder = args[0] || "totogi-docs"

	console.log(
		`Scraping Totogi API docs and splitting sections into ${outputFolder}...`
	)

	try {
		scrapeTotogiDocsAndSplitSections(outputFolder)
			.then(() => console.log("Done!"))
			.catch((error) => {
				console.error("Error:", error.message)
				process.exit(1)
			})
	} catch (error) {
		console.error("Error:", (error as Error).message)
		process.exit(1)
	}
}
