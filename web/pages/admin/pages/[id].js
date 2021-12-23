import AdminLayout from '../../../components/AdminLayout';
import Markdown from '../../../components/Markdown';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import Notice from '../../../components/Notice';
import Form from '../../../components/Form';
import { useRouter } from 'next/router';
import { gql, useMutation, useQuery } from 'urql';
import { useState } from 'react';

const PAGE_FRAGMENT = gql`
	fragment Page on Page {
		id
		title 
		slug
		text
	}
`;

export default function EditPage () {
	const [success, setSuccess] = useState(false);
	const { query: { id }, push } = useRouter();
	const isNew = id === 'new';

	const [{ data }] = useQuery({
		query: gql`
			query GetPage ($id: UUID!) {
				page (id: $id) {
					...Page
				}
			}
			${PAGE_FRAGMENT}
		`,
		variables: { id },
		pause: isNew,
	});

	const page = data?.page;

	const [{ error: createError }, create] = useMutation(gql`
        mutation CreatePage ($input: CreatePageInput!) {
            createPage (input: $input) {
                page {
                    ...Page
                }
            }
        }
        ${PAGE_FRAGMENT}
	`);

	const [{ error: saveError }, save] = useMutation(gql`
        mutation SavePage (
            $id: UUID!
            $patch: PagePatch!
        ) {
            updatePage (input: {
                id: $id
                patch: $patch
            }) {
                page {
                    ...Page
                }
            }
        }
        ${PAGE_FRAGMENT}
	`);

	const [, remove] = useMutation(gql`
        mutation DeletePage ($id: UUID!) {
            deletePage (input: {
                id: $id
            }) {
                clientMutationId
            }
        }
	`);

	const onSubmit = async patch => {
		setSuccess(false);

		if (isNew) {
			const { data } = await create({
				input: {
					page: patch,
				},
			});

			const id = data?.createPage?.page?.id;
			if (id) await push(`/admin/pages/${id}`);
		} else {
			await save({
				id: page.id,
				patch,
			});
		}

		setSuccess(true);
	};

	const onDelete = async () => {
		if (!window.confirm('Are you sure?'))
			return;

		await remove({
			id: page.id,
		});

		await push('/admin/pages');
	};

	return (
		<AdminLayout title={page?.title ?? 'New Page'}>
			<Form onSubmit={onSubmit}>
				<Input
					name="title"
					label="Title"
					defaultValue={page?.title}
					required
				/>
				<Input
					name="slug"
					label="Slug"
					defaultValue={page?.slug}
					required
				/>
				<Markdown
					name="text"
					label="Text"
					defaultValue={page?.text}
				/>
				<footer>
					<Button type="submit">Save</Button>
					{createError && (
						<Notice label="Error">
							{createError}
						</Notice>
					)}
					{saveError && (
						<Notice label="Error">
							{saveError}
						</Notice>
					)}
					{success && (
						<Notice label="Success">
							Page saved!
						</Notice>
					)}
				</footer>
			</Form>
		</AdminLayout>
	);
}
