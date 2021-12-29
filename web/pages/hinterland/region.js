import dynamic from 'next/dynamic';
import Title from '../../components/Title';
const Region = dynamic(() => import('../../hinterland/region'), { ssr: false });

export default function RegionGeneration () {
	return (
		<>
			<Title>Region</Title>
			<Region />
		</>
	);
}
