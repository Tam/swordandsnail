import AdminLayout from '../../components/AdminLayout';
import Stat, { Stats } from '../../components/Stat';

export default function Admin () {
	return (
		<AdminLayout title="Dashboard">
			<Stats>
				<Stat label="Players" value={302} />
				<Stat label="Designers" value={14} />
				<Stat label="Games" value={20} />
				<Stat label="Sessions" value={87329} />
				<Stat label="Pages" value={2} />
			</Stats>
		</AdminLayout>
	);
}
