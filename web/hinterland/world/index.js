import css from './style.module.scss';
import Button from '../../components/Button';
import { useState } from 'react';
import Tooltip from '../../components/Tooltip';
import Input from '../../components/Input';
import cls from '../../util/cls';
import randomFromArray from '../../util/random';
import BezierInput from '../../components/BezierInput';
import bezier from '../../util/bezier';
import capitalize from '../../util/capitalize';
import { Signal, Emit } from '../../util/signal';

const DEFAULT_SPAWN_RATES = {
	"biomes": {
		"forest": {
			"startY": 1,
			"ax": 0.6789473684210526,
			"ay": 0.6017543859649123,
			"bx": 0.6789473684210526,
			"by": 0.6017543859649123,
			"endY": 0
		},
		"mountain": {
			"startY": 0,
			"ax": 1,
			"ay": 0,
			"bx": 1,
			"by": 0,
			"endY": 1
		},
		"desert": {
			"startY": 0,
			"ax": 0.6964912280701754,
			"ay": 0.26140350877192986,
			"bx": 0.6964912280701754,
			"by": 0.26140350877192986,
			"endY": 0
		},
		"lake": {
			"startY": 0,
			"ax": 0.8719298245614036,
			"ay": 0.543859649122807,
			"bx": 0.8719298245614036,
			"by": 0.543859649122807,
			"endY": 0
		},
		"plains": {
			"startY": 1,
			"ax": 0.6403508771929824,
			"ay": 0.6333333333333333,
			"bx": 0.6403508771929824,
			"by": 0.6333333333333333,
			"endY": 0
		}
	},
	"resources": {
		"barren": {
			"startY": 0,
			"ax": 1,
			"ay": 0,
			"bx": 0.3701754385964912,
			"by": 0.062280701754385936,
			"endY": 0.04824561403508776
		},
		"fortress": {
			"startY": 0,
			"ax": 0.7456140350877193,
			"ay": 0,
			"bx": 1,
			"by": 0,
			"endY": 0.4491228070175438
		},
		"pirate_ship": {
			"startY": 0,
			"ax": 0.7280701754385965,
			"ay": 0,
			"bx": 1,
			"by": 0.23421052631578942,
			"endY": 0.6657894736842105
		},
		"fish": {
			"startY": 0.5,
			"ax": 0.5,
			"ay": 0.5,
			"bx": 0.5,
			"by": 0.5,
			"endY": 0.5
		},
		"wild_game": {
			"startY": 0.5,
			"ax": 0.5070175438596491,
			"ay": 0.0903508771929824,
			"bx": 0.5070175438596491,
			"by": 0.0903508771929824,
			"endY": 0.5
		},
		"farmland": {
			"startY": 0.5,
			"ax": 0.5,
			"ay": 0.5,
			"bx": 0.5,
			"by": 0.5,
			"endY": 0.5
		},
		"fresh_water": {
			"startY": 0.5,
			"ax": 0.5,
			"ay": 0.5,
			"bx": 0.5,
			"by": 0.5,
			"endY": 0.5
		},
		"stone": {
			"startY": 0.5,
			"ax": 0.5,
			"ay": 0.5,
			"bx": 0.5,
			"by": 0.5,
			"endY": 0.5
		},
		"iron": {
			"startY": 0.5,
			"ax": 0.5,
			"ay": 0.5,
			"bx": 0.5,
			"by": 0.5,
			"endY": 0.5
		},
		"clay": {
			"startY": 0.2710526315789473,
			"ax": 0.48947368421052634,
			"ay": 0.18333333333333335,
			"bx": 0.48947368421052634,
			"by": 0.18333333333333335,
			"endY": 0.5
		},
		"wood": {
			"startY": 0.7885964912280702,
			"ax": 0.5,
			"ay": 0.5,
			"bx": 0.5,
			"by": 0.5,
			"endY": 0.5
		}
	}
};

const BIOME = {
	'FOREST': { weight: 0.44, icon: '🌳' },
	'MOUNTAIN': { weight: 0.04, icon: '🏔' },
	'DESERT': { weight: 0.04, icon: '🏜' },
	'LAKE': { weight: 0.04, icon: '💧' },
	'PLAINS': { weight: 0.44, icon: '🌾' },
};

const RESOURCE = {
	'BARREN': { type: 'EMPTY', icon: '', biome: ['*'] },
	'FORTRESS': { type: 'SPAWNER', icon: '🏰', biome: ['PLAINS','FOREST','MOUNTAIN','DESERT'] },
	'PIRATE_SHIP': { type: 'SPAWNER', icon: '☠️', biome: ['LAKE'] },
	'FISH': { type: 'FOOD', icon: '🐟', biome: ['LAKE'] },
	'WILD_GAME': { type: 'FOOD', icon: '🦌', biome: ['PLAINS', 'FOREST'] },
	'FARMLAND': { type: 'FOOD', icon: '👩‍🌾', biome: ['PLAINS'] },
	'FRESH_WATER': { type: 'BONUS', icon: '💦', biome: ['LAKE'] },
	'STONE': { type: 'SUPPLY', icon: '🪨', biome: ['MOUNTAIN'] },
	'IRON': { type: 'SUPPLY', icon: '⛓', biome: ['MOUNTAIN', 'DESERT'] },
	'CLAY': { type: 'SUPPLY', icon: '🧱', biome: ['MOUNTAIN', 'LAKE'] },
	'WOOD': { type: 'SUPPLY', icon: '🪵', biome: ['FOREST'] },
};

const MOB = {
	'ORK': { biome: ['MOUNTAIN', 'DESERT'], icon: '🤢' },
	'DARK_ELF': { biome: ['FOREST', 'PLAINS'], icon: '🧝‍♂️' },
	'DARK_DWARF': { biome: ['MOUNTAIN'], icon: '⛏' },
	'DROWNED_DEAD': { biome: ['LAKE'], icon: '🏊‍♂️' },
	'SHARKS': { biome: ['LAKE'], icon: '🦈' },
	'SPIDERS': { biome: ['FOREST'], icon: '🕷' },
	'WOLVES': { biome: ['FOREST', 'PLAINS'], icon: '🐺' },
	'UNDEAD': { biome: ['FOREST', 'DESERT', 'MOUNTAIN'], icon: '🧟‍♂️' },
	'GIANT': { biome: ['FOREST', 'DESERT', 'MOUNTAIN'], icon: '🧍‍♂️' },
	'PIRATES': { biome: ['LAKE'], resource: ['PIRATE_SHIP'], icon: '🏴‍☠️' },
};

function byBiome (set) {
	return Object.keys(set).reduce((a, b) => {
		const resource = set[b];

		if (resource.biome === null)
			return a;

		let targetBiomes = resource.biome;

		if (resource.biome?.[0] === '*')
			targetBiomes = Object.keys(BIOME);

		targetBiomes.forEach(biome => {
			if (!a.hasOwnProperty(biome)) a[biome] = [];
			a[biome].push(b);
		});

		return a;
	}, {});
}

const RESOURCE_BY_BIOME = byBiome(RESOURCE)
	, MOB_BY_BIOME = byBiome(MOB);

function weightedRandom (spec) {
	let key, sum = 0, r = Math.random();
	for (key in spec) {
		sum += spec[key].weight;
		if (r <= sum) return key;
	}
}

function insideCircle (x, y, rad = 3) {
	return (x * x + y * y) <= rad * rad;
}

function generateWorld (mapSize = 5, spawnRates) {
	const world = [];

	for (let y = -mapSize, l = mapSize; y <= l; y++) {
		for (let x = -mapSize, l = mapSize; x <= l; x++) {
			if (!insideCircle(x, y, mapSize + 0.5)) {
				world.push({ x, y, isEmpty: true });
				continue;
			}

			if (x === 0 && y === 0) {
				world.push({ x, y, isVillage: true });
				continue;
			}

			let difficulty = 1,
				rad = 1.5;

			while (rad < 8)
				if (!insideCircle(x, y, rad++))
					difficulty++;

			const depth = difficulty;

			if (difficulty > 1) {
				if (Math.random() > 0.95) difficulty += 2;
				else if (Math.random() > 0.8) difficulty++;
				else if (Math.random() < 0.1) difficulty--;
			}

			const t = depth / mapSize;
			const biomeKeys = Object.keys(BIOME);

			const biomeWeightedByDepth = {};
			let weightSum = 0;
			for (let i = 0, l = biomeKeys.length; i < l; i++) {
				const k = biomeKeys[i]
				const key = k.toLowerCase();
				const weight = spawnRates.biomes?.[key] ? bezier(spawnRates.biomes[key], t)[1] : 1 / biomeKeys.length;
				weightSum += weight;
				biomeWeightedByDepth[k] = { weight };
			}

			// Normalize weights to sum to 1
			for (let i = 0, l = biomeKeys.length; i < l; i++)
				biomeWeightedByDepth[biomeKeys[i]].weight /= weightSum;

			const biome = weightedRandom(biomeWeightedByDepth);

			const allowedResources = RESOURCE_BY_BIOME[biome];
			const resourcesWeightedByDepth = {};

			weightSum = 0;
			for (let i = 0, l = allowedResources.length; i < l; i++) {
				const k = allowedResources[i]
				const key = k.toLowerCase();
				const weight = spawnRates.resources?.[key] ? bezier(spawnRates.resources[key], t)[1] : 1 / allowedResources.length;
				weightSum += weight;
				resourcesWeightedByDepth[k] = { weight };
			}

			// Normalize weights to sum to 1
			for (let i = 0, l = allowedResources.length; i < l; i++)
				resourcesWeightedByDepth[allowedResources[i]].weight /= weightSum;

			const resource = weightedRandom(resourcesWeightedByDepth);
			let mob;

			do {
				mob = randomFromArray(MOB_BY_BIOME[biome]);
				const res = MOB[mob].resource;
				if (res !== void 0 && res.indexOf(resource) === -1)
					mob = null;
			} while (mob === null);

			world.push({ x, y, difficulty, biome, resource, mob, isExplored: depth === 1 });
		}
	}

	// Emit(Signal.Notify, { message: 'New world generated!' });

	return world;
}

export default function World () {
	const [mapSize, setMapSize] = useState(4)
		, [spawnRates, setSpawnRates] = useState(DEFAULT_SPAWN_RATES);
	const [world, setWorld] = useState(() => generateWorld(mapSize, spawnRates));
	const [appearance, setAppearance] = useState({
		biomeIcons: true,
		resourceIcons: true,
		mobIcons: true,
		fogOfWar: true,
	});

	const coordToIndex = (x, y) => (x + mapSize) + (mapSize * 2 + 1) * (y + mapSize);

	const onGenerateClick = () => setWorld(generateWorld(mapSize, spawnRates))
		, onMapSizeChange = e => {
			const size = +e.target.value;
			setMapSize(size);
			setWorld(generateWorld(size, spawnRates));
		};

	const onBezierInput = (key, group) => values => setSpawnRates(old => ({
		...old,
		[group]: {
			...old[group],
			[key]: values,
		}
	}));

	const onCheckboxChange = key => e => setAppearance(old => ({
		...old,
		[key]: e.target.checked,
	}));

	const onCellClick = ({ x, y }) => () => {
		setWorld(old => {
			const next = [...old];
			const l = next.length;
			let coord;

			if ((coord = coordToIndex(x - 1, y)) < l && coord > 0 && next[coord].y === y) next[coord].isExplored = true;
			if ((coord = coordToIndex(x + 1, y)) < l && next[coord].y === y) next[coord].isExplored = true;
			if ((coord = coordToIndex(x, y)) < l) next[coord].isExplored = true;
			if ((coord = coordToIndex(x, y - 1)) < l && coord > 0) next[coord].isExplored = true;
			if ((coord = coordToIndex(x, y + 1)) < l) next[coord].isExplored = true;

			return next;
		});
	};

	return (
		<div className={css.wrap}>
			<div>
				<div className={css.world} style={{'--map-size': mapSize}}>
					{world.map((cell, i) => {
						if (cell.isEmpty)
							return <span key={i} className={css.cell} />;

						if (cell.isVillage) {
							return (
								<Tooltip key={`${mapSize}_${i}`} content={(
									<>
										<strong>Your Village</strong> ({cell.x}, {cell.y})
									</>
								)}>
									<span className={cls(css.cell, css.village)}>
										🏘
									</span>
								</Tooltip>
							);
						}

						const { x, y, difficulty, biome, resource, mob } = cell;

						return (
							<Tooltip key={`${mapSize}_${i}`} content={(
								<>
									<strong>Untamed Hinterland</strong> ({x}, {y})<br/>
									<strong>Difficulty:</strong> {difficulty}<br/>
									{(!appearance.fogOfWar || cell.isExplored) && (
										<>
											<strong>Biome:</strong> {biome}<br/>
											<strong>Resource:</strong> {resource}<br/>
											<strong>Mob:</strong> {mob}
										</>
									)}
								</>
							)}>
								<span className={css.cell} onClick={onCellClick(cell)}>
									<span className={css.icons}>
										{appearance.fogOfWar && !cell.isExplored ? (
											<small>☁️</small>
										) : (
											<>
												{appearance.resourceIcons && RESOURCE[resource].icon && <small>{RESOURCE[resource].icon}</small>}
												{appearance.biomeIcons && <small>{BIOME[biome].icon}</small>}
												{appearance.mobIcons && <small>{MOB[mob].icon}</small>}
											</>
										)}
									</span>
									<span className={css.difficulty}>
										{Array.from(
											{length:difficulty},
											(_, i) => <i key={i} />
										)}
									</span>
								</span>
							</Tooltip>
						);
					})}
				</div>
			</div>
			<aside>
				<Button onClick={onGenerateClick}>Generate World</Button>
				<br/><br/>
				<Input
					label="Map Size"
					type="range"
					min={2}
					max={6}
					defaultValue={mapSize}
					onInput={onMapSizeChange}
				/>
				<details>
					<summary>Appearance</summary>
					<Input
						label="Biome Icons" type="checkbox"
						defaultChecked={appearance.biomeIcons}
						onChange={onCheckboxChange('biomeIcons')}
					/>
					<Input
						label="Resource Icons" type="checkbox"
						defaultChecked={appearance.resourceIcons}
						onChange={onCheckboxChange('resourceIcons')}
					/>
					<Input
						label="Mob Icons" type="checkbox"
						defaultChecked={appearance.mobIcons}
						onChange={onCheckboxChange('mobIcons')}
					/>
					<Input
						label="Fog of War" type="checkbox"
						defaultChecked={appearance.fogOfWar}
						onChange={onCheckboxChange('fogOfWar')}
					/>
				</details>
				<details>
					<summary>Biome Spawns</summary>
					{Object.keys(BIOME).map(k => k.toLowerCase()).map(key => (
						<BezierInput
							key={key}
							label={capitalize(key)}
							onInput={onBezierInput(key, 'biomes')}
							defaultValue={spawnRates.biomes[key]}
						/>
					))}
				</details>
				<details>
					<summary>Resource Spawns</summary>
					{Object.keys(RESOURCE).map(k => k.toLowerCase()).map(key => (
						<BezierInput
							key={key}
							label={capitalize(key)}
							onInput={onBezierInput(key, 'resources')}
							defaultValue={spawnRates.resources[key]}
						/>
					))}
				</details>
				<details>
					<summary>Spawn Rates JSON</summary>
					<pre onClick={e => window.getSelection().selectAllChildren(e.target)}>{JSON.stringify(spawnRates, null, 2)}</pre>
				</details>
			</aside>
		</div>
	);
}
