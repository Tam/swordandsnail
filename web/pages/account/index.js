import AccountLayout from '../../components/AccountLayout';
import Form from '../../components/Form';
import Input from '../../components/Input';
import { gql, useMutation, useQuery } from 'urql';
import Button from '../../components/Button';
import { useState } from 'react';
import Notice from '../../components/Error';

export default function Account () {
	const [success, setSuccess] = useState(false);

	const [{ data, fetching }] = useQuery({
		query: gql`
			query Profile {
				viewer {
					id
					name
					account {
						email
					}
				}
			}
		`
	});

	const [{ fetching: saving }, save] = useMutation(gql`
		mutation SaveProfile (
			$id: UUID!
			$userPatch: UserPatch!
			$accountPatch: AccountPatch!
		) {
			updateUser (input: {
				id: $id
				patch: $userPatch
			}) {
				clientMutationId
			}
			updateAccount(input: {
				userId: $id
				patch: $accountPatch
			}) {
				clientMutationId
			}
		}
	`);

	const onSubmit = async input => {
		setSuccess(false);

		await save({
			id: data.viewer.id,
			userPatch: input.user,
			accountPatch: input.account,
		});

		setSuccess(true);
	};

	return (
		<AccountLayout title="Profile" key={fetching}>
			<Form onSubmit={onSubmit}>
				<Input
					label="Name"
					name="user.name"
					defaultValue={data?.viewer?.name}
				/>

				<Input
					label="Email"
					name="account.email"
					type="email"
					defaultValue={data?.viewer?.account?.email}
					required
				/>

				<footer>
					<Button type="submit" disabled={saving}>Save</Button>
					{success && (
						<Notice label="Success">
							Profile saved!
						</Notice>
					)}
				</footer>
			</Form>
		</AccountLayout>
	);
}
