import { useEffect, useMemo, useReducer } from 'react';
import createClient, { SessionData } from '../lib/client';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

/**
 * Usage:
 * ```jsx
 * import { Provider } from 'urql';
 * import { useCreateClient } from 'common/hooks';
 * import { cookies } from 'common/util';
 *
 * function MyApp () {
 *     const client = useCreateClient(...);
 *
 *     return (
 *         <Provider client={client}>
 *             ...
 *         </Provider>
 *     );
 * }
 *
 * MyApp.getInitialProps = ({ ctx }) => {
 *     cookies.setCookieContext(ctx);
 *     return {};
 * };
 * ```
 *
 * Set `NEXT_PUBLIC_API="my api endpoint"` to override
 *
 * @param {string?} defaultPostLoginRedirect - The default post-login redirect path
 * @param {string[]?} unprotectedRoutes - Any routes that require the user to NOT be authenticated
 * @param {string[]?} agnosticRoutes - Any routes that don't care about auth status (i.e. 404/500 error pages)
 * @returns {*|Client}
 */
export default function useCreateClient ({
	defaultPostLoginRedirect = '/',
	unprotectedRoutes = [],
	agnosticRoutes = ['/404', '/500'],
}) {
	const router = useRouter();
	const refresher = useReducer(() => ({}))[1];

	useEffect(() => {
		SessionData.isLoggedIn = !!Cookies.get('snail.ssrid');
		refresher();

		// Do nothing for agnostic routes
		if (agnosticRoutes.indexOf(router.route) > -1)
			return;

		// If the user is logged in and trying to access a no-auth route,
		// redirect them to the dashboard
		if (unprotectedRoutes.indexOf(router.route) > -1) {
			if (SessionData.isLoggedIn) {
				// redirectPostLogin(router, defaultPostLoginRedirect);
				router.push(defaultPostLoginRedirect);
			}
			return;
		}

		// If they're trying to access any other route while not logged in,
		// redirect them to login
		if (!SessionData.isLoggedIn) {
			// Emit(Events.Notify, 'You must be logged in to view that page');
			// setCookie('tripmapper_post_login', router.asPath);
			router.push('/');
		}
	}, []);

	return useMemo(() => {
		return createClient();
	}, []);
}
