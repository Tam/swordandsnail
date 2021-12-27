import css from './style.module.scss';
import Button from '../../components/Button';
import { useEffect, useMemo, useState } from 'react';
import Input from '../../components/Input';

const TEST_SQUARE = `# # #
#    #
# # #`;

function generateWorld () {
	const world = [];

	for (let y = 0, l = 11; y < l; y++) {
		for (let x = 0, l = 11; x < l; x++) {
			world.push([x, y]);
		}
	}

	return world;
}

function insideCircle (x, y, rad = 3) {
	const dx = 5 - x
		, dy = 5 - y;

	return (dx * dx + dy * dy) <= rad * rad;
}

export default function World () {
	const [rad, setRad] = useState(2.5)
		, [thickness, setThickness] = useState(1);

	const world = useMemo(() => {
		return generateWorld();
	}, []);

	useEffect(() => {
		const i = setInterval(() => {
			setRad(r => {
				r = r + thickness;
				if (r > 7 + thickness) r = 0.5;
				return r;
			})
		}, 250 * thickness);

		return () => {
			clearInterval(i);
		};
	}, [thickness]);

	const onRadChange = e => setRad(+e.target.value)
		, onThicknessChange = e => setThickness(+e.target.value);

	return (
		<div className={css.wrap}>
			<div className={css.world}>
				{world.map(([x, y], i) => (
					<span key={i}>
						{insideCircle(x, y, rad) && !insideCircle(x, y, rad - thickness)
							? TEST_SQUARE
							: `${x}, ${y}`
						}
					</span>
				))}
			</div>
			<div>
				<Button>Generate World</Button>
				<br/><br/>
				<Input
					label="Circle Radius"
					type="range"
					defaultValue={rad}
					min={0.5}
					max={6.5 + thickness}
					step={thickness}
					onInput={onRadChange}
				/>
				<Input
					label="Circle Thickness"
					type="range"
					defaultValue={thickness}
					min={1}
					max={3}
					step={1}
					onInput={onThicknessChange}
				/>
			</div>
		</div>
	);
}
