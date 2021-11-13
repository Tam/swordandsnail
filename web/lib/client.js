import { authExchange } from '@urql/exchange-auth';
import { retryExchange } from '@urql/exchange-retry';
import { cacheExchange, dedupExchange, createClient as _createClient } from 'urql';

export const URI = process.env.NEXT_PUBLIC_API || 'https://dev.api.swordandsnail.com/graphql';
export const SessionData = {
	isLoggedIn: false,
	expires: null,
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
				return (SessionData.expires && SessionData.expires <= Date.now()) || SessionData.isLoggedIn === false;
			},
		}),
		retryExchange({}),
	].filter(Boolean),
	fetchOptions: {
		credentials: 'include',
	},
};

export default function createClient () {
	return _createClient(clientOpts);
};
