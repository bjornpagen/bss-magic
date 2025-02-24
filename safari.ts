import UserAgent from "user-agents"

const userAgent = new UserAgent(/Safari/).toString()

export const safariHeaders: HeadersInit = {
	Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
	"Accept-Encoding": "gzip, deflate, br",
	"Accept-Language": "en-US,en;q=0.9",
	Priority: "u=0, i",
	"Sec-Fetch-Dest": "document",
	"Sec-Fetch-Mode": "navigate",
	"Sec-Fetch-Site": "none",
	"User-Agent": userAgent
}
