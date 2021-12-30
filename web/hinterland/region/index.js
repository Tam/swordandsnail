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
		renderer.blit();

		const onKeyPress = e => {
			switch (e.key) {
				case 'i':
					renderer.setZoom(zoom => zoom + 0.25);
					break;
				case 'k':
					renderer.setZoom(zoom => zoom - 0.25);
					break;
				case 'w': renderer.moveCamera(0, 1); break;
				case 's': renderer.moveCamera(0, -1); break;
				case 'a': renderer.moveCamera(1, 0); break;
				case 'd': renderer.moveCamera(-1, 0); break;
			}
		};

		document.addEventListener('keydown', onKeyPress);

		return () => {
			document.removeEventListener('keydown', onKeyPress);
		};
	}, [renderer]);

	const onGenerateClick = () => {
		forest(renderer, GRID_WIDTH, GRID_HEIGHT);
		renderer.blit();
	};

	return (
		<div className={css.wrap}>
			<Button onClick={onGenerateClick}>Generate</Button>
			<canvas ref={self} />
		</div>
	);
}
