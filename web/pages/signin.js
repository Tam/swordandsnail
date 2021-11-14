import Input from '../components/Input';
import AuthForm from '../components/AuthForm';
import Button from '../components/Button';
import A from '../components/A';
import Notice from '../components/Error';
import { gql, useMutation } from 'urql';
import { SessionData } from '../lib/client';
import { useRouter } from 'next/router';

export default function Home () {
	const router = useRouter();

	const [{ data, fetching }, login] = useMutation(gql`
		mutation Login (
			$email: String!
			$password: String!
		) {
			authenticate (
				email: $email
				password: $password
			)
		}
	`);

	const onSubmit = async ({ email, password }) => {
		const { data } = await login({
			email,
			password,
		});

		if (data?.authenticate) {
			SessionData.isLoggedIn = true;
			await router.push('/games');
		}
	};

	return (
		<AuthForm title="Sign in" onSubmit={onSubmit}>
			{data?.authenticate === false && (
				<Notice label="Error">Invalid email or password!</Notice>
			)}

			<Input
				label="Email"
				name="email"
				type="email"
				required
				autoFocus
			/>
			<Input
				label="Password"
				name="password"
				type="password"
				required
			/>

			<footer>
				<Button type="submit" disabled={fetching}>Sign In</Button>
				<A href="/forgot">Forgot Password</A>
			</footer>
		</AuthForm>
	);
}
