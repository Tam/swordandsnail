import AdminLayout from '../../../components/AdminLayout';
import Table from '../../../components/Table';

export default function Users () {
	return (
		<AdminLayout title="Users">
			<Table
				columns={[
					{ handle: 'name', label: 'Name', render: Table.link((_, row) => `/admin/user/${row.id}`) },
					{ handle: 'account.email', label: 'Email' },
					{ handle: 'account.role', label: 'Role', render: Table.capitalize },
					{ handle: 'createdAt', label: 'Created', render: Table.timestamp },
					{ handle: 'edit', label: null, render: Table.link((_, row) => `/admin/user/${row.id}`, '[E]') },
				]}
				data={[
					{
						id: 'xxxx-4xxx-xxxx-xxxx',
						name: 'Test',
						createdAt: Date.now(),
						account: {
							email: 'test@test.com',
							role: 'player',
						}
					},
					{
						id: 'xxxx-4xxx-xxxx-xxxx',
						name: 'Test',
						createdAt: Date.now(),
						account: {
							email: 'test@test.com',
							role: 'player',
						}
					},
					{
						id: 'xxxx-4xxx-xxxx-xxxx',
						name: 'Test',
						createdAt: Date.now(),
						account: {
							email: 'test@test.com',
							role: 'player',
						}
					},
					{
						id: 'xxxx-4xxx-xxxx-xxxx',
						name: 'Test',
						createdAt: Date.now(),
						account: {
							email: 'test@test.com',
							role: 'player',
						}
					},
				]}
			/>
		</AdminLayout>
	);
}
