import AuthForm from '../components/AuthForm';
import Input from '../components/Input';
import Button from '../components/Button';
import A from '../components/A';
import { useState } from 'react';
import Notice from '../components/Error';

export default function Forgot () {
	const [sent, setSent] = useState(false);

	const onSubmit = () => {
		setSent(true);
	};

	return (
		<AuthForm title="Forgotten Password" onSubmit={onSubmit}>
			{sent ? (
				<Notice label="Success">Reset link sent!</Notice>
			) : (
				<Input
					label="Email"
					name="email"
					type="email"
					required
					autoFocus
				/>
			)}

			<footer>
				<Button type="submit" disabled={sent}>Send Reset Link</Button>
				<A href="/">&larr; Back</A>
			</footer>
		</AuthForm>
	);
}
