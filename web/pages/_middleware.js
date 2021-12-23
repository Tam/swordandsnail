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

	const isPublicUrl = PUBLIC_URLS.indexOf(url.pathname) > -1;
	const isProtectedUrl = PUBLIC_URLS.indexOf(url.pathname) === -1 && AGNOSTIC_URLS.indexOf(url.pathname) === -1;

	if (!sid) {
		const resp = await fetch(URI.replace('graphql', 'session'), {
			method: 'GET',
			//credentials: 'include',
		});

		if (isProtectedUrl) {
			const res = NextResponse.redirect(LOGIN_URL);
			res.cookie('snail.post_login', url.pathname, { secure: true, httpOnly: true });
			res.headers.set('Set-Cookie', resp.headers.get('Set-Cookie'));
			return res;
		}

		const res = NextResponse.next();
		res.headers.set('Set-Cookie', resp.headers.get('Set-Cookie'));

		return res;
	}

	const resp = await fetch(URI, {
		method: 'POST',
		//credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			'cookie': req.headers.get('cookie'),
		},
		body: JSON.stringify({
			operationName: 'Viewer',
			query: 'query Viewer { viewer { account { role } } }',
		}),
	}).then(r => r.json());

	if (!resp?.data?.viewer) {
		let res = NextResponse.next();

		if (isProtectedUrl) {
			res = NextResponse.redirect(LOGIN_URL);
			res.cookie('snail.post_login', url.pathname, { secure: true, httpOnly: true });
		}

		return res;
	}

	const postLoginRedirect = req.cookies['snail.post_login'];

	if (postLoginRedirect) {
		const res = NextResponse.redirect(postLoginRedirect);
		res.cookie('snail.post_login', '', { maxAge: 0, secure: true, httpOnly: true });

		return res;
	}

	if (isPublicUrl)
		return NextResponse.redirect(POST_LOGIN_URL);

	const role = resp?.data?.viewer?.account?.role;

	if (!role)
		return NextResponse.rewrite('/404');

	for (let [path, roles] of Object.entries(ROLE_PROTECTED_URLS))
		if (url.pathname.startsWith(path) && roles.indexOf(role) === -1)
			return NextResponse.rewrite('/404');

	return NextResponse.next();
}
