import AccountLayout from '../../components/AccountLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Form from '../../components/Form';
import { useState } from 'react';
import Notice from '../../components/Error';
import { gql, useMutation } from 'urql';
import e from '../../util/e';

export default function Security () {
	const [success, setSuccess] = useState(false);
	const [{ fetching, error }, save] = useMutation(gql`
		mutation UpdatePassword ($input: UpdatePasswordInput!) {
			updatePassword(input: $input) {
				clientMutationId
			}
		}
	`);

	const onSubmit = async (input, e) => {
		setSuccess(false);
		const { error } = await save({ input });
		if (!error) {
			e.target.reset();
			setSuccess(true);
		}
	};

	const err = error?.graphQLErrors?.[0]?.message;

	return (
		<AccountLayout title="Security">
			<Form onSubmit={onSubmit}>
				<Input
					label="Current Password"
					name="currentPassword"
					type="password"
					required
				/>

				<Input
					label="New Password"
					name="newPassword"
					type="password"
					required
				/>

				<footer>
					<Button type="submit" disabled={fetching}>Save</Button>
					{err ? (
						<Notice label="Error">
							{e(err)}
						</Notice>
					) : success && (
						<Notice label="Success">
							Password updated!
						</Notice>
					)}
				</footer>
			</Form>
		</AccountLayout>
	);
}
