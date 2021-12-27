// Stolen from https://gist.github.com/kerimdzhanov/7529623

/**
 * Get a random floating point number between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random floating point number
 */
export function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}

/**
 * Get a random integer between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random integer
 */
export function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Get a random boolean value.
 *
 * @return {boolean} a random true/false
 */
export function getRandomBool() {
	return Math.random() >= 0.5;
}

/**
 * Returns a random value from the given array
 *
 * @param {Array} array
 * @returns {*}
 */
export default function randomFromArray (array) {
	return array[Math.floor(Math.random() * array.length)];
}
