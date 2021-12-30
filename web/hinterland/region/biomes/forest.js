import randomFromArray from '../../../util/random';

export default function forest (renderer, width, height) {
	const terrain = [];

	// Randomly fill map with solid blocks
	for (let y = 0, l = height; y < l; y++) {
		for (let x = 0, l = width; x < l; x++) {
			if (x <= 1 || x >= width - 2 || y <= 1 || y >= height - 2 || Math.random() > 0.33) {
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

	// Find holes
	const holes = getRegions(0)
		, clearings = [];

	holes.forEach(region => {
		// Flood-fill small holes
		if (region.length <= 50) {
			region.forEach(i => {
				terrain[i] = 1;
			});
		}

		// Collect large clearings
		else {
			clearings.push({
				cells: region,
				cellCount: region.length,
				edgeCells: region.filter(i => {
					const x = i % width
						, y = (i / width)|0;

					for (let ny = y - 1; ny <= y + 1; ny++) {
						for (let nx = x - 1; nx <= x + 1; nx++) {
							if (
								(nx === x || ny === y) // is cardinal
								&& (
									!cellInRange(nx, ny) // is out of range
									|| terrain[nx + width * ny] === 1 // or in-range and wall
								)
							) return true;
						}
					}

					return false;
				}),
				connectedRegions: [],
				isMainRegion: false,
				isConnectedToMainRegion: false,
				setIsConnectedToMainRegion () {
					if (this.isConnectedToMainRegion) return;
					this.isConnectedToMainRegion = true;
					this.connectedRegions.forEach(region => region.setIsConnectedToMainRegion());
				},
				isConnectedToRegion (region) {
					return this.connectedRegions.indexOf(region) > -1;
				},
			});
		}
	});

	// Sort clearings by size (largest -> smallest)
	clearings.sort(((a, b) => b.cellCount - a.cellCount));
	clearings[0].isMainRegion = true;
	clearings[0].isConnectedToMainRegion = true;

	// Connect regions
	const corridors = [];

	function connectRegions (regionA, regionB, cellA, cellB) {
		if (regionA.isConnectedToMainRegion) regionB.setIsConnectedToMainRegion();
		else if (regionB.isConnectedToMainRegion) regionA.setIsConnectedToMainRegion();

		regionA.connectedRegions.push(regionB);
		regionB.connectedRegions.push(regionA);

		corridors.push({
			ax: cellA % width,
			ay: (cellA / width)|0,
			bx: cellB % width,
			by: (cellB / width)|0,
		});
	}

	function connectClosestRegions (allRegions, forceConnectionToMainRegion = false) {
		let regionListA, regionListB;

		if (forceConnectionToMainRegion) {
			regionListA = [];
			regionListB = [];

			for (let i = 0, l = allRegions.length; i < l; i++) {
				const region = allRegions[i];
				if (region.isConnectedToMainRegion) regionListB.push(region);
				else regionListA.push(region);
			}
		} else {
			regionListA = allRegions;
			regionListB = allRegions;
		}

		let bestDistance = 0,
			bestCellA,
			bestCellB,
			bestRegionA,
			bestRegionB,
			possibleConnectionFound = false;

		for (const regionA of regionListA) {
			if (!forceConnectionToMainRegion) {
				possibleConnectionFound = false;
				if (regionA.connectedRegions.length > 0) continue;
			}

			for (const regionB of regionListB) {
				if (regionA === regionB || regionA.isConnectedToRegion(regionB))
					continue;

				for (const cellA of regionA.edgeCells) {
					for (const cellB of regionB.edgeCells) {
						const ax = cellA % width
							, ay = (cellA / width)|0
							, bx = cellB % width
							, by = (cellB / width)|0;

						const x = ax - bx
							, y = ay - by;

						const approxDistance = x * x + y * y;

						if (approxDistance < bestDistance || !possibleConnectionFound) {
							bestDistance = approxDistance;
							possibleConnectionFound = true;
							bestCellA = cellA;
							bestCellB = cellB;
							bestRegionA = regionA;
							bestRegionB = regionB;
						}
					}
				}
			}

			if (possibleConnectionFound && !forceConnectionToMainRegion)
				connectRegions(bestRegionA, bestRegionB, bestCellA, bestCellB);
		}

		if (possibleConnectionFound && forceConnectionToMainRegion) {
			connectRegions(bestRegionA, bestRegionB, bestCellA, bestCellB);
			connectClosestRegions(allRegions, true);
		}

		if (!forceConnectionToMainRegion)
			connectClosestRegions(allRegions, true);
	}

	connectClosestRegions(clearings);

	// Render the cells
	renderer.clearCanvas();
	terrain.forEach((full, i) => full && renderer.drawChar({
		char: randomFromArray(['🌲','🌴','🌳']),
		position: {
			x: i % width,
			y: (i / width)|0,
		},
	}));

	// Render the corridors
	corridors.forEach(c => renderer.drawDebugLine(c.ax, c.ay, c.bx, c.by));
}
