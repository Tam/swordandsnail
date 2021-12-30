import randomFromArray from '../../../util/random';

export default function forest (renderer, width, height) {
	const terrain = [];

	// Randomly fill map with solid blocks
	for (let y = 0, l = height; y < l; y++) {
		for (let x = 0, l = width; x < l; x++) {
			if (x <= 1 || x >= width - 2 || y <= 1 || y >= height - 2 || Math.random() > 0.35) {
				terrain.push(1);
			} else {
				terrain.push(0);
			}
		}
	}

	const cellInRange = (x, y) => {
		const i = (x + width * y);
		return i >= 0 && i < terrain.length;
	};

	// Iterate over the map using cellular automata
	let iterations = 8;
	while (iterations--) {
		for (let y = 0, l = height; y < l; y++) {
			for (let x = 0, l = width; x < l; x++) {
				if (terrain[x + width * y] === void 0) continue;

				let neighbourCount = 0;

				for (let ny = y - 1; ny <= y + 1; ny++) {
					for (let nx = x - 1; nx <= x + 1; nx++) {
						if ((nx === x && ny === y) || !cellInRange(nx, ny)) continue;
						if (terrain[nx + width * ny]) neighbourCount++;
					}
				}

				if (neighbourCount < 4) terrain[x + width * y] = 0;
			}
		}
	}

	function getRegionCells (startingIndex, maxCellsInRegion, parentCellsVisited) {
		const regionCells = [];

		const cellType = terrain[startingIndex];
		const queue = [startingIndex]
			, cellsVisited = [startingIndex];

		while (queue.length > 0)
		{
			const cell = queue.pop();
			regionCells.push(cell);

			const x = cell % width
				, y = (cell / width)|0;

			for (let nx = x - 1; nx <= x + 1; nx++) {
				for (let ny = y - 1; ny <= y + 1; ny++) {
					if (!cellInRange(nx, ny)) continue;
					if (nx === x || ny === y) { // ignore corners
						const i = nx + width * ny;
						if (cellsVisited.indexOf(i) > -1) continue;
						cellsVisited.push(i);
						parentCellsVisited && parentCellsVisited.push(i);

						if (maxCellsInRegion && cellsVisited.length >= maxCellsInRegion)
							return null;

						if (terrain[i] !== cellType) continue;
						queue.push(i);
					}
				}
			}
		}

		return regionCells;
	}

	function getRegions (cellType, maxCellsInRegion = null) {
		const regions = []
			, cellsVisited = [];

		for (let i = 0, l = terrain.length; i < l; i++) {
			if (cellsVisited.indexOf(i) > -1) continue;
			cellsVisited.push(i);
			if (terrain[i] !== cellType) continue;
			const region = getRegionCells(i, maxCellsInRegion, cellsVisited);
			region && regions.push(region);
		}

		return regions;
	}

	// Flood-fill small holes
	const holes = getRegions(0, 50);

	holes.forEach(region => {
		region.forEach(i => {
			terrain[i] = 1;
		});
	});

	// Render the cells
	renderer.clearCanvas();
	terrain.forEach((full, i) => full && renderer.drawChar({
		char: randomFromArray(['🌲','🌴','🌳']),
		position: {
			x: i % width,
			y: (i / width)|0,
		},
	}));
}
