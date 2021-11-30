import { authExchange } from '@urql/exchange-auth';
import { retryExchange } from '@urql/exchange-retry';
import { cacheExchange, dedupExchange, fetchExchange, createClient as _createClient } from 'urql';
import { URI } from './consts';
import Cookies from 'js-cookie';

export const SessionData = {
	isLoggedIn: !!Cookies.get('snail.ssrid'),
};

export const clientOpts = {
	url: URI,
	exchanges: [
		dedupExchange,
		cacheExchange,
		authExchange({
			async getAuth () {
				return null;
			},

			addAuthToOperation ({ operation }) {
				return operation;
			},

			didAuthError ({ error }) {
				const { status } = error.response;
				return status === 401 || status === 403;
			},

			willAuthError () {
				return SessionData.isLoggedIn === false;
			},
		}),
		retryExchange({}),
		fetchExchange,
	].filter(Boolean),
	fetchOptions: {
		credentials: 'include',
	},
};

export default function createClient () {
	return _createClient(clientOpts);
};
