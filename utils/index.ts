/**
 * Capitalize first letter and trim edges of text
 * @param {string} text to be formatted
 * @returns {string} formatted text
 */
export function trimEdgesAndCapitalizeFirstLetter(text: string) {
	if (!text) return; // invalid text

	if (text.length === 1) return text.toUpperCase(); // single letter

	let newStr = text.trim(); // trim edges
	return newStr.charAt(0).toUpperCase() + newStr.slice(1); // capitalize first letter
}
