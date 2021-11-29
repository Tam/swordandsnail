import { NextResponse } from 'next/server';
import { URI } from '../lib/consts';

export async function middleware (req) {
	const res = NextResponse.next();
	const ssrid = req.cookies['snail.ssrid'];

	if (!ssrid)
		return res;

	const resp = await fetch(URI, {
		method: 'POST',
		body: JSON.stringify({
			operationName: 'VerifySSRID',
			query: 'query VerifySSRID ($id: String!) { verifySsrid(ssrid: $id) }',
			variables: { id: ssrid },
		}),
		headers: { 'Content-Type': 'application/json' },
	}).then(res => res.json());

	if (!resp?.data?.verifySsrid) {
		res.cookie('snail.ssrid', '', { maxAge: 0, secure: true, httpOnly: true });
	}

	return res;
}
