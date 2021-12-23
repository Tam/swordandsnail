import AdminLayout from '../../../components/AdminLayout';
import Table, { TblFmt } from '../../../components/Table';
import { gql, useQuery } from 'urql';

export default function Users () {
	const [{ data }] = useQuery({
		query: gql`
			query GetUsers {
				usersList {
					id
					name
					createdAt
					account {
						id: nodeId
						email
						role
					}
				}
			}
		`,
	});

	return (
		<AdminLayout title="Users">
			<Table
				columns={[
					{ handle: 'name', label: 'Name', render: TblFmt.link((_, row) => `/admin/users/${row.id}`) },
					{ handle: 'account.email', label: 'Email' },
					{ handle: 'account.role', label: 'Role', render: TblFmt.capitalize },
					{ handle: 'createdAt', label: 'Created', render: TblFmt.timestamp },
					{ handle: 'edit', label: null, render: TblFmt.link((_, row) => `/admin/users/${row.id}`, '[E]') },
				]}
				data={data?.usersList}
			/>
		</AdminLayout>
	);
}
