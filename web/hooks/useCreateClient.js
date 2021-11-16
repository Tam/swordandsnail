import { useEffect, useMemo, useReducer, useState } from 'react';
import unfetch from 'isomorphic-unfetch';
import createClient, { SessionData, URI } from '../lib/client';
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
	const [isChecking, setIsChecking] = useState(true);

	// Refresh all the things when the token changes
	const refresher = useReducer(() => ({}))[1];

	useEffect(() => {
		unfetch(URI, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({
				operationName: 'CheckAuth',
				query: 'mutation CheckAuth { requestSsrid (input: {}) { string } }',
			}),
			headers: { 'Content-Type': 'application/json' },
		}).then(r => r.json()).then(res => {
			const ssrid = res?.data?.requestSsrid?.string;
			Cookies.set('snail.ssrid', ssrid, { secure: true, sameSite: 'strict' });
			SessionData.isLoggedIn = ssrid !== null;
		}).finally(() => {
			setIsChecking(false);
			refresher();
		});
	}, []);

	const router = useRouter()
		, isLoggedIn = SessionData.isLoggedIn;

	let preventRenderDuringRedirect = isChecking;

	useEffect(() => {
		// Do nothing if we're checking
		if (isChecking)
			return;

		// Do nothing for agnostic routes
		if (agnosticRoutes.indexOf(router.route) > -1)
			return;

		// If the user is logged in and trying to access a no-auth route,
		// redirect them to the dashboard
		if (unprotectedRoutes.indexOf(router.route) > -1) {
			if (isLoggedIn) {
				// redirectPostLogin(router, defaultPostLoginRedirect);
				router.push(defaultPostLoginRedirect);
				preventRenderDuringRedirect = true;
			}
			return;
		}

		// If they're trying to access any other route while not logged in,
		// redirect them to login
		if (!isLoggedIn) {
			// Emit(Events.Notify, 'You must be logged in to view that page');
			// setCookie('tripmapper_post_login', router.asPath);
			router.push('/');
			preventRenderDuringRedirect = true;
		}
	}, [isChecking, isLoggedIn, router.pathname]);

	return useMemo(() => {
		return [createClient(), preventRenderDuringRedirect];
	}, [SessionData.isLoggedIn, isChecking]);
}
