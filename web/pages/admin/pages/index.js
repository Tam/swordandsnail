import AdminLayout from '../../../components/AdminLayout';
import Table from '../../../components/Table';
import Button from '../../../components/Button';
import Markdown from '../../../components/Markdown';

export default function Pages () {
	return (
		<AdminLayout
			title="Pages"
			actions={(
				<>
					<Button wide>New Page</Button>
				</>
			)}
		>
			<Table
				columns={[
					{ handle: 'title', label: 'Title', render: Table.link((_, { id }) => `/admin/pages/${id}`) },
					{ handle: 'slug', label: 'Slug', render: Table.link(slug => `/${slug}`) },
					{ handle: 'createdAt', label: 'Created', render: Table.timestamp },
					{ handle: 'updatedAt', label: 'Updated', render: Table.timestamp },
				]}
				data={[
					{
						id: 'xxxx-4xxx-xxxx-xxxx',
						title: 'Terms & Conditions',
						slug: 'terms',
						createdAt: Date.now(),
						updatedAt: Date.now(),
					},
					{
						id: 'xxxx-4xxx-xxxx-xxxx',
						title: 'Privacy Policy',
						slug: 'privacy',
						createdAt: Date.now(),
						updatedAt: Date.now(),
					},
				]}
			/>

			<Markdown />
		</AdminLayout>
	);
}