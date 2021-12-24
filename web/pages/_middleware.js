import { NextResponse } from 'next/server';
import { URI } from '../lib/consts';

const LOGIN_URL = '/signin'
	, POST_LOGIN_URL = '/games';

const PUBLIC_URLS = [
	'/signin',
	'/signup',
	'/forgot',
	'/reset',
];

const AGNOSTIC_URLS = [
	'/',
	'/400',
	'/500',
	'/_error',
];

const ROLE_PROTECTED_URLS = {
	'/admin': ['ADMIN'],
	'/studio': ['ADMIN', 'DESIGNER'],
};

export async function middleware (req) {
	const sid = req.cookies['snails.satchel'];
	const url = new URL(req.url);

	{
		// TODO: Cache this
		const resp = await fetch(URI, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				operationName: 'GetPages',
				query: 'query GetPages { pagesList { slug } }',
			}),
		}).then(r => r.json());

		resp?.data?.pagesList?.map(p => AGNOSTIC_URLS.push(`/${p.slug}`));
	}

	const isPublicUrl = PUBLIC_URLS.indexOf(url.pathname) > -1;
	const isProtectedUrl = PUBLIC_URLS.indexOf(url.pathname) === -1 && AGNOSTIC_URLS.indexOf(url.pathname) === -1;

	// If we don't already have a session
	if (!sid) {
		// Generate a new session
		const resp = await fetch(URI.replace('graphql', 'session'), {
			method: 'GET',
		});

		let res = NextResponse.next();

		// If they're trying to access a protected url, store it for later and
		// redirect to login
		if (isProtectedUrl) {
			res = NextResponse.redirect(LOGIN_URL);
			res.cookie('snail.post_login', url.pathname, { secure: true, httpOnly: true });
		}

		setIsLoggedInCookie(res, 0);
		res.headers.set('Set-Cookie', resp.headers.get('Set-Cookie'));

		return res;
	}

	// If we have a session, check to see if it belongs to a logged in user
	const resp = await fetch(URI, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'cookie': req.headers.get('cookie'),
		},
		body: JSON.stringify({
			operationName: 'Viewer',
			query: 'query Viewer { viewer { account { role } } }',
		}),
	})
		.then(r => r.json())
		.catch(() => void 0);

	// If the user isn't logged in
	if (!resp?.data?.viewer) {
		let res = NextResponse.next();

		if (isProtectedUrl) {
			res = NextResponse.redirect(LOGIN_URL);
			res.cookie('snail.post_login', url.pathname, { secure: true, httpOnly: true });
		}

		setIsLoggedInCookie(res, 0);

		return res;
	}

	// If they tried to access a protected page, redirect them back to it
	const postLoginRedirect = req.cookies['snail.post_login'];

	if (postLoginRedirect) {
		const res = NextResponse.redirect(postLoginRedirect);
		res.cookie('snail.post_login', '', { maxAge: 0, secure: true, httpOnly: true });
		setIsLoggedInCookie(res, 1);

		return res;
	}

	// If it's a public only URL, redirect them to the post login page
	if (isPublicUrl) {
		const res = NextResponse.redirect(POST_LOGIN_URL);
		setIsLoggedInCookie(res, 1);

		return res;
	}

	// Verify they have the correct permissions to access the page,
	// 404ing if the don't
	const role = resp?.data?.viewer?.account?.role;

	if (!role)
		return NextResponse.rewrite('/404');

	for (let [path, roles] of Object.entries(ROLE_PROTECTED_URLS))
		if (url.pathname.startsWith(path) && roles.indexOf(role) === -1)
			return NextResponse.rewrite('/404');

	const res = NextResponse.next();
	setIsLoggedInCookie(res, 1);

	return res;
}

const setIsLoggedInCookie = (res, val) =>
	res.cookie('snail.logged_in', val ? '1' : '', { maxAge: val ? void 0 : 0, secure: true, httpOnly: true });
