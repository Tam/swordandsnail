import errors from '../data/errors.json';
import { CombinedError } from 'urql';

export default function e (key) {
	if (key instanceof CombinedError)
		key = key.graphQLErrors?.[0]?.message ?? key.networkError?.message;

	return errors[key] ?? key;
}
