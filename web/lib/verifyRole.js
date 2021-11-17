import { URI } from './consts';

export default async function verifyRole (req, role) {
	const ssrid = req.cookies['snail.ssrid'];
	if (!ssrid) return false;

	const res = await fetch(URI, {
		method: 'POST',
		credentials: 'include',
		body: JSON.stringify({
			operationName: 'VerifySsrid',
			query: 'query VerifySsrid ($ssrid: String!) { verifySsrid (ssrid: $ssrid) }',
			variables: { ssrid },
		}),
		headers: { 'Content-Type': 'application/json' },
	}).then(res => res.json());

	return res?.data?.verifySsrid.toLowerCase() === role.toLocaleString();
}
