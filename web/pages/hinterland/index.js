import Title from '../../components/Title';
import dynamic from 'next/dynamic';
const World = dynamic(() => import('../../hinterland/world'), { ssr: false });

export default function Hinterland () {
	return (
		<>
			<Title>Hinterland</Title>
			<World />
		</>
	);
}
