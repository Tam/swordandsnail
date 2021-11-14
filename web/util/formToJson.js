import set from 'lodash.set';

/**
 * Converts the given Form to a JSON Object
 *
 * @param {HTMLFontElement} form
 * @returns {Object}
 */
export default function formToJson (form) {
	const object = {};

	(new FormData(form)).forEach((value, key) => {
		set(object, key, value);
	});

	return object;
}
