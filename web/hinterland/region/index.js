import css from './style.module.scss';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Renderer from './renderer';
import Button from '../../components/Button';
import forest from './biomes/forest';

const GRID_WIDTH = 100
	, GRID_HEIGHT = 50;

export default function Region () {
	const self = useRef();

	// useMemo isn't working for some reason...
	const [renderer, setRenderer] = useState(null);
	useLayoutEffect(() => {
		setRenderer(new Renderer(self.current, GRID_WIDTH, GRID_HEIGHT));
	}, [self]);

	useEffect(() => {
		if (!renderer) return;

		forest(renderer, GRID_WIDTH, GRID_HEIGHT);

		// const player = { char: '@', position: { x: 0, y: 0 } };
		// drawChar(player);

		// const onUserInput = e => {
		// 	let { x, y } = player.position;
		//
		// 	switch (e.key) {
		// 		case 'ArrowUp':
		// 			y -= 1;
		// 			break;
		// 		case 'ArrowDown':
		// 			y += 1;
		// 			break;
		// 		case 'ArrowLeft':
		// 			x -= 1;
		// 			break;
		// 		case 'ArrowRight':
		// 			x += 1;
		// 			break;
		// 	}
		//
		// 	if (x >= grid.width) x = 0;
		// 	if (x < 0) x = grid.width - 1;
		// 	if (y >= grid.height) y = 0;
		// 	if (y < 0) y = grid.height - 1;
		//
		// 	if (map[x + grid.width * y] === null) {
		// 		player.position.x = x;
		// 		player.position.y = y;
		// 	}
		// };
		//
		// document.addEventListener('keydown', onUserInput);
		//
		// let looping = true;
		//
		// const loop = () => {
		// 	clearCanvas();
		//
		// 	map.forEach(drawChar);
		// 	drawChar(player);
		//
		// 	looping && requestAnimationFrame(loop);
		// };
		//
		// loop();
		//
		// return () => {
		// 	looping = false;
		// 	document.removeEventListener('keydown', onUserInput);
		// };
	}, [renderer]);

	const onGenerateClick = () => forest(renderer, GRID_WIDTH, GRID_HEIGHT);

	return (
		<div className={css.wrap}>
			<Button onClick={onGenerateClick}>Generate</Button>
			<canvas ref={self} />
		</div>
	);
}
