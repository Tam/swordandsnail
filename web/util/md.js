import { parse } from 'marked';

export default function md (str, variables = {}) {
	str = str.replace(/!{(.*)}/gm, (_, match) => {
		const [key, ...filters] = match.split('|');
		let value = variables[key] ?? `[[Missing variable: ${key}]]`;

		for (let i = 0, l = filters.length; i < l; i++) {
			const filter = filters[i];

			try {
				switch (filter) {
					case 'date':
						const d = new Date(value);
						if (isNaN(d)) throw 'Invalid Date';
						value = d.toLocaleDateString('en-GB', { dateStyle: 'long' });
						break;
				}
			} catch (e) {
				value = `_[[Filter failed: **${filter}** for **${key}** resolved as **${value}**]]_`;
			}
		}

		return value;
	});

	return parse(str);
}
