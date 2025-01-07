import { WebHackingMethods } from "./constant";

/**
 * This function format the WebHackingMethods to proper string.
 * @param SQL_INJECTION
 * @returns```Sql Injection```
 */
export function formatHackingMethod(text: WebHackingMethods): string {
	// Replace underscores with spaces and split the text into words
	const formattedText = text
		.replaceAll("_", " ")
		.toLowerCase() // Convert all to lowercase initially
		.replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word

	// Optionally: Handle acronyms or special cases
	const acronyms = ["XSS", "SQL Injection", "CSRF", "SSRF"];
	if (
		acronyms.some(acronym => formattedText.includes(acronym.toLowerCase()))
	) {
		return formattedText.replace(
			/\b(XSS|SQL Injection|CSRF|SSRF)\b/g,
			match => match.toUpperCase()
		);
	}

	return formattedText;
}
