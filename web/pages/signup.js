import AuthForm from '../components/AuthForm';
import Input from '../components/Input';
import Button from '../components/Button';

export default function SignUp () {
	return (
		<AuthForm title="Sign Up">
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
				<Button type="submit">Sign Up</Button>
			</footer>
		</AuthForm>
	);
}
