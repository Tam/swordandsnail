import css from './style.module.scss';
import { useEffect, useRef } from 'react';

export default function Region () {
	const self = useRef();

	useEffect(() => {
		if (!self.current) return;
		const canvas = self.current
			, pixelRatio = window.devicePixelRatio || 1;

		const ctx = canvas.getContext('2d');

		const grid = {
			width: 100,
			height: 34,
		};

		const lineHeight = 1.2
			, textColour = window.getComputedStyle(document.body).getPropertyValue('color');

		let calculatedFontSize = window.innerWidth / grid.width;
		let cellWidth = calculatedFontSize * pixelRatio;
		let cellHeight = calculatedFontSize * lineHeight * pixelRatio;
		let fontSize = calculatedFontSize * pixelRatio;

		canvas.style.cssText = `width: ${calculatedFontSize * grid.width}; height: ${
			calculatedFontSize * lineHeight * grid.height
		}`;
		canvas.width = cellWidth * grid.width;
		canvas.height = cellHeight * grid.height;

		ctx.font = `normal ${fontSize}px ${window.getComputedStyle(document.body).getPropertyValue('font-family').split(',')[0]}`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		const clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
		const drawChar = c => {
			if (!c) return;
			const { char, position } = c;

			ctx.fillStyle = textColour;
			ctx.fillText(
				char,
				position.x * cellWidth + cellWidth / 2,
				position.y * cellHeight + cellHeight / 2
			);
		};

		const player = { char: '@', position: { x: 0, y: 0 } };
		drawChar(player);

		const map = [];

		for (let y = 0, l = grid.height; y < l; y++) {
			for (let x = 0, l = grid.width; x < l; x++) {
				map.push(Math.random() > 0.75 ? {
					char: '🌳',
					position: { x, y },
				} : null);
			}
		}

		const onUserInput = e => {
			let { x, y } = player.position;

			switch (e.key) {
				case 'ArrowUp':
					y -= 1;
					break;
				case 'ArrowDown':
					y += 1;
					break;
				case 'ArrowLeft':
					x -= 1;
					break;
				case 'ArrowRight':
					x += 1;
					break;
			}

			if (x >= grid.width) x = 0;
			if (x < 0) x = grid.width - 1;
			if (y >= grid.height) y = 0;
			if (y < 0) y = grid.height - 1;
			
			if (map[x + grid.width * y] === null) {
				player.position.x = x;
				player.position.y = y;
			}
		};

		document.addEventListener('keydown', onUserInput);

		let looping = true;

		const loop = () => {
			clearCanvas();

			map.forEach(drawChar);
			drawChar(player);

			looping && requestAnimationFrame(loop);
		};

		loop();

		return () => {
			looping = false;
			document.removeEventListener('keydown', onUserInput);
		};
	}, [self]);

	return (
		<div className={css.wrap}>
			<canvas
				ref={self}
			/>
		</div>
	);
}
