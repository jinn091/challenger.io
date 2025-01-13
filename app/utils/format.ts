import { ChallengeStatus } from "@prisma/client";
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

/**
 * ```formatChallengeStatusToString``` function is use to convert challenge status into string
 * @param text
 * @returns ```string```
 *
 * @example ON_GOING -> On Going
 */
export function formatChallengeStatusToString(status: ChallengeStatus): string {
	const formattedText = status
		.replaceAll("_", " ")
		.toLowerCase() // Convert all to lowercase initially
		.replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word

	return formattedText;
}

/**
 * ```getFileExtension``` function is use to parse file extensions.
 * @example "image.jpg" -> ".jpg"
 */
export function getFileExtension(fileName: string): string {
	const lastDotIndex = fileName.lastIndexOf(".");
	return lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : "";
}
