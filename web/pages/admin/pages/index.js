import AdminLayout from '../../../components/AdminLayout';
import Table, { TblFmt } from '../../../components/Table';
import Button from '../../../components/Button';
import { gql, useQuery } from 'urql';

export default function Pages () {
	const [{ data }] = useQuery({
		query: gql`
			query Pages {
				pagesList {
					id
					title
					slug
					createdAt
					updatedAt
				}
			}
		`,
	});

	return (
		<AdminLayout
			title="Pages"
			actions={(
				<>
					<Button wide href="/admin/pages/new">New Page</Button>
				</>
			)}
		>
			<Table
				columns={[
					{ handle: 'title', label: 'Title', render: TblFmt.link((_, { id }) => `/admin/pages/${id}`) },
					{ handle: 'slug', label: 'Slug', render: TblFmt.link(slug => `/${slug}`) },
					{ handle: 'createdAt', label: 'Created', render: TblFmt.timestamp },
					{ handle: 'updatedAt', label: 'Updated', render: TblFmt.timestamp },
					{ handle: 'edit', label: null, render: TblFmt.link((_, row) => `/admin/pages/${row.id}`, '[E]') },
				]}
				data={data?.pagesList}
			/>
		</AdminLayout>
	);
}
