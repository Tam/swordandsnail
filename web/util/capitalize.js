/**
 * Capitalize the first letter of the given string
 *
 * @param {string} str
 * @param {boolean=} forceLower
 * @return {string}
 */
export default function capitalize (str, forceLower = false) {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + (forceLower ? str.slice(1).toLowerCase() : str.slice(1));
}
