import AdminLayout from '../../../components/AdminLayout';
import Table, { TblFmt } from '../../../components/Table';

export default function Users () {
	return (
		<AdminLayout title="Users">
			<Table
				columns={[
					{ handle: 'name', label: 'Name', render: TblFmt.link((_, row) => `/admin/user/${row.id}`) },
					{ handle: 'account.email', label: 'Email' },
					{ handle: 'account.role', label: 'Role', render: TblFmt.capitalize },
					{ handle: 'createdAt', label: 'Created', render: TblFmt.timestamp },
					{ handle: 'edit', label: null, render: TblFmt.link((_, row) => `/admin/user/${row.id}`, '[E]') },
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
