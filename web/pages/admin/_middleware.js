import { NextResponse } from 'next/server';
import verifyRole from '../../lib/verifyRole';

export async function middleware (req) {
	if (await verifyRole(req, 'admin'))
		return NextResponse.next();

	return NextResponse.rewrite('/404');
}
