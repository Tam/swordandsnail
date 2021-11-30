import { gql } from 'urql';
import Cookies from 'js-cookie';
import { SessionData } from '../lib/client';

export default async function postLoginAction (client, router) {
	const { data } = await client.mutation(gql`
        mutation CheckAuth {
            requestSsrid (input: {}) {
                string
            }
        }
	`).toPromise();

	Cookies.set('snail.ssrid', data?.requestSsrid?.string, { secure: true, sameSite: 'strict' });
	SessionData.isLoggedIn = true;
	await router.push('/games');
}
