import AuthForm from '../components/AuthForm';
import Input from '../components/Input';
import Button from '../components/Button';
import { gql, useClient, useMutation } from 'urql';
import Notice from '../components/Notice';
import e from '../util/e';
import { useRouter } from 'next/router';
import postLoginAction from '../util/postLoginAction';

export default function SignUp () {
	const router = useRouter()
		, client = useClient();

	const [{ error, fetching }, register] = useMutation(gql`
		mutation Register (
			$name: String!
			$email: String!
			$password: String!
		) {
			register (
				name: $name
				email: $email
				password: $password
			)
		}
	`);

	const onSubmit = async variables => {
		const { data } = await register(variables);

		if (data?.register)
			await postLoginAction(client, router);
	};

	return (
		<AuthForm title="Sign Up" onSubmit={onSubmit}>
			{error && (
				<Notice label="Error">
					{e(error)}
				</Notice>
			)}

			<Input
				label="Name"
				name="name"
				required
				autoFocus
			/>
			<Input
				label="Email"
				name="email"
				type="email"
				required
			/>
			<Input
				label="Password"
				name="password"
				type="password"
				required
			/>

			<footer>
				<Button type="submit" disabled={fetching}>Sign Up</Button>
			</footer>
		</AuthForm>
	);
}
