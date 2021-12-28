import Title from '../components/Title';
import A from '../components/A';
import BezierInput from '../components/BezierInput';

export default function Games () {
	return (
		<>
			<Title>Games</Title>
			<h1>Games</h1>
			<ul>
				<li><A href="/hinterland">Into the Hinterlands</A></li>
			</ul>

			<div>
				<BezierInput />
			</div>
		</>
	);
}
