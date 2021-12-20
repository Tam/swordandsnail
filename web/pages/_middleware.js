import { NextResponse } from 'next/server';
import { URI } from '../lib/consts';

const LOGIN_URL = '/signin';

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

export async function middleware (req) {
	const ssrid = req.cookies['snail.ssrid'];

	const isProtectedUrl = PUBLIC_URLS.indexOf(req.url) === -1 && AGNOSTIC_URLS.indexOf(req.url) === -1;

	// If we don't have an SSRID
	if (!ssrid) {
		if (isProtectedUrl) {
			const res = NextResponse.redirect(LOGIN_URL);
			res.cookie('snail.post_login', req.url, { secure: true, httpOnly: true });
			return res;
		}

		return NextResponse.next();
	}

	// Verify the SSRID
	const resp = await fetch(URI, {
		method: 'POST',
		body: JSON.stringify({
			operationName: 'VerifySSRID',
			query: 'query VerifySSRID ($id: String!) { verifySsrid(ssrid: $id) }',
			variables: { id: ssrid },
		}),
		headers: { 'Content-Type': 'application/json' },
	}).then(r => r.json());

	// If verification failed
	if (!resp?.data?.verifySsrid) {
		let res;
		if (isProtectedUrl) {
			res = NextResponse.redirect(LOGIN_URL);
			res.cookie('snail.post_login', req.url, { secure: true, httpOnly: true });
		}
		else res = NextResponse.next();

		// Clear the SSRID cookie
		res.cookie('snail.ssrid', '', { maxAge: 0, secure: true, httpOnly: true });

		return res;
	}

	const postLoginRedirect = req.cookies['snail.post_login'];

	if (postLoginRedirect) {
		const res = NextResponse.redirect(postLoginRedirect);
		res.cookie('snail.post_login', '', { maxAge: 0, secure: true, httpOnly: true });

		return res;
	}

	return NextResponse.next();
}
