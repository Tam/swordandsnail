import AdminLayout from '../../components/AdminLayout';
import Stat, { Stats } from '../../components/Stat';
import { gql, useQuery } from 'urql';

export default function Admin () {
	const [{ data }] = useQuery({
		query: gql`
			query GetStats {
				pages { totalCount }
				users { totalCount }
			}
		`,
	});

	return (
		<AdminLayout title="Dashboard">
			<Stats>
				<Stat label="Players" value={302} />
				<Stat label="Designers" value={14} />
				<Stat label="Games" value={20} />
				<Stat label="Users" value={data?.users?.totalCount} />
				<Stat label="Pages" value={data?.pages?.totalCount} />
			</Stats>
		</AdminLayout>
	);
}
