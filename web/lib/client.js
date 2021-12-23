import { authExchange } from '@urql/exchange-auth';
import { retryExchange } from '@urql/exchange-retry';
import { cacheExchange, dedupExchange, fetchExchange, createClient as _createClient } from 'urql';
import { requestPolicyExchange } from '@urql/exchange-request-policy';
import { URI } from './consts';

export const clientOpts = (ssrExchange, ctx) => ({
	url: URI,
	exchanges: [
		dedupExchange,
		requestPolicyExchange({}),
		cacheExchange,
		ssrExchange,
		authExchange({
			async getAuth () {
				return null;
			},

			addAuthToOperation ({ operation }) {
				return operation;
			},

			didAuthError ({ error }) {
				const status = error?.response?.status;
				return status === 401 || status === 403;
			},

			willAuthError () {
				return false;
			},
		}),
		retryExchange({}),
		fetchExchange,
	].filter(Boolean),
	fetchOptions: {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'cookie': ctx?.req?.headers?.cookie,
		},
	},
});

export default function createClient () {
	return _createClient(clientOpts());
};
