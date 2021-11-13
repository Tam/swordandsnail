import { gql, useMutation } from 'urql';
import Button from '../components/Button';
import { SessionData } from '../lib/client';
import { useRouter } from 'next/router';

export default function Games () {
	const router = useRouter();
	const [, logout] = useMutation(gql`
		mutation Logout {
			logout
		}
	`);

	return (
		<div>
			hello

			<Button onClick={async () => {
				SessionData.isLoggedIn = false;
				await logout();
				await router.push('/');
			}}>Sign out</Button>
		</div>
	);
}
