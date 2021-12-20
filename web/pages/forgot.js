import AuthForm from '../components/AuthForm';
import Input from '../components/Input';
import Button from '../components/Button';
import A from '../components/A';
import { useState } from 'react';
import Notice from '../components/Notice';
import { gql, useMutation } from 'urql';

export default function Forgot () {
	const [sent, setSent] = useState(false);

	const [{ fetching, error }, requestReset] = useMutation(gql`
		mutation RequestReset ($input: RequestPasswordResetInput!) {
			requestPasswordReset (input: $input) {
				clientMutationId
			}
		}
	`);

	const onSubmit = async input => {
		const Bowser = (await import('bowser')).default;
		const browser = Bowser.getParser(window.navigator.userAgent);

		input.operatingSystem = browser.getOSName() + ' ' + browser.getOSVersion();
		input.browserName = browser.getBrowserName() + ' ' + browser.getBrowserVersion();

		const { error } = await requestReset({
			input,
		});

		!error && setSent(true);
	};

	return (
		<AuthForm title="Forgotten Password" onSubmit={onSubmit}>
			{error && (
				<Notice label="Error">{error.message}</Notice>
			)}

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
				<Button type="submit" disabled={fetching || sent}>Send Reset Link</Button>
				<A href="/signin">&larr; Back</A>
			</footer>
		</AuthForm>
	);
}
