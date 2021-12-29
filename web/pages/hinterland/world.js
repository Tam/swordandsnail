import dynamic from 'next/dynamic';
import Title from '../../components/Title';
const World = dynamic(() => import('../../hinterland/world'), { ssr: false });

export default function WorldGeneration () {
	return (
		<>
			<Title>World</Title>
			<World />
		</>
	);
}
