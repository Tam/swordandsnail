/**
 * Converts the given Form to a JSON Object
 *
 * @param {HTMLFontElement} form
 * @returns {Object}
 */
export default function formToJson (form) {
	const object = {};

	(new FormData(form)).forEach((value, key) => {
		if(!Reflect.has(object, key)){
			object[key] = value;
			return;
		}

		if(!Array.isArray(object[key]))
			object[key] = [object[key]];

		object[key].push(value);
	});

	return object;
}
