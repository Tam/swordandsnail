import errors from '../data/errors.json';

export default function e (key) {
	return errors[key] ?? key;
}
