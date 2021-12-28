/**
 * Clamp the given number between a min and max
 *
 * @param {number} number
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export default function clamp (number, min = 0, max = 1) {
	return Math.min(Math.max(number, min), max);
}
