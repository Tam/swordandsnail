import AccountLayout from '../../components/AccountLayout';
import Input from '../../components/Input';
import { gql, useMutation, useQuery } from 'urql';
import FontPreviews from '../../components/FontPreviews';
import { useEffect, useState } from 'react';
import TextPreview from '../../components/TextPreview';
import Button from '../../components/Button';
import Form from '../../components/Form';
import Notice from '../../components/Error';
import e from '../../util/e';

export default function Preferences () {
	const [col, setCol] = useState(80)
		, [success, setSuccess] = useState(false);

	const [{ data, fetching }] = useQuery({
		query: gql`
			query Preferences {
				viewer {
					id
					preference {
                        id: nodeId
						font
						textColumnWidth
						theme
					}
				}
			}
		`,
	});

	const [{ error, fetching: saving }, save] = useMutation(gql`
		mutation SavePreferences ($input: UpdatePreferenceInput!) {
			updatePreference (input: $input) {
				preference {
					id: nodeId
					font
					textColumnWidth
					theme
				}
			}
		}
	`);

	useEffect(() => {
		setCol(data?.viewer?.preference?.textColumnWidth);
	}, [data]);

	const onColChange = e => setCol(e.target.value);
	const err = error?.graphQLErrors?.[0]?.message;

	const onSubmit = async patch => {
		setSuccess(false);
		patch.textColumnWidth = +patch.textColumnWidth;
		patch.theme = patch.theme.toUpperCase();
		await save({
			input: {
				patch,
				userId: data.viewer.id,
			},
		});
		setSuccess(true);
	};

	return (
		<AccountLayout title="Preferences" key={fetching}>
			<Form onSubmit={onSubmit}>
				<Input
					label="Theme"
					name="theme"
					type="select"
					defaultValue={data?.viewer?.preference?.theme.toLowerCase()}
				>
					<option value="light">Light</option>
					<option value="dark">Dark</option>
					<option value="system">System</option>
				</Input>

				<Input
					label="Font"
					name="font"
					type="select"
					defaultValue={data?.viewer?.preference?.font.toLowerCase()}
				>
					<option value="mono">Mono</option>
					<option value="duo">Duo</option>
					<option value="quattro">Quattro</option>
				</Input>

				<FontPreviews />

				<Input
					label="Text Column Width"
					name="textColumnWidth"
					type="range"
					defaultValue={data?.viewer?.preference?.textColumnWidth}
					min={36}
					max={180}
					onInput={onColChange}
				/>

				<TextPreview width={col} />

				<footer>
					<Button type="submit" disabled={saving}>Save</Button>
					{err ? (
						<Notice label="Error">
							{e(err)}
						</Notice>
					) : success && (
						<Notice label="Success">
							Preferences saved!
						</Notice>
					)}
				</footer>
			</Form>
		</AccountLayout>
	);
}
