import css from './style.module.scss';
import Button from '../../components/Button';
import { useState } from 'react';
import Tooltip from '../../components/Tooltip';
import Input from '../../components/Input';
import cls from '../../util/cls';
import randomFromArray from '../../util/random';
import BezierInput, { BEZIER_DEFAULT } from '../../components/BezierInput';
import bezier from '../../util/bezier';

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
	'ORK': { biome: ['MOUNTAIN', 'DESERT'] },
	'DARK_ELF': { biome: ['FOREST', 'PLAINS'] },
	'DARK_DWARF': { biome: ['MOUNTAIN'] },
	'DROWNED_DEAD': { biome: ['LAKE'] },
	'SHARKS': { biome: ['LAKE'] },
	'SPIDERS': { biome: ['FOREST'] },
	'WOLVES': { biome: ['FOREST', 'PLAINS'] },
	'UNDEAD': { biome: ['FOREST', 'DESERT', 'MOUNTAIN'] },
	'GIANT': { biome: ['FOREST', 'DESERT', 'MOUNTAIN'] },
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

			if (difficulty > 1) {
				if (Math.random() > 0.95) difficulty += 2;
				else if (Math.random() > 0.8) difficulty++;
				else if (Math.random() < 0.1) difficulty--;
			}

			const biome = weightedRandom(BIOME);
			const allowedResources = RESOURCE_BY_BIOME[biome];

			const t = difficulty / mapSize;
			const resourcesWeightedByDifficulty = {};

			let weightSum = 0;
			for (let i = 0, l = allowedResources.length; i < l; i++) {
				const k = allowedResources[i]
				const key = k.toLowerCase();
				const weight = spawnRates?.[key] ? bezier(spawnRates[key], t)[1] : 1 / allowedResources.length;
				weightSum += weight;
				resourcesWeightedByDifficulty[k] = { weight };
			}

			// Normalize weights to sum to 1
			for (let i = 0, l = allowedResources.length; i < l; i++)
				resourcesWeightedByDifficulty[allowedResources[i]].weight /= weightSum;
			
			const resource = weightedRandom(resourcesWeightedByDifficulty);
			const mob = randomFromArray(MOB_BY_BIOME[biome]);

			world.push({ x, y, difficulty, biome, resource, mob });
		}
	}

	return world;
}

export default function World () {
	const [mapSize, setMapSize] = useState(4)
		, [spawnRates, setSpawnRates] = useState({
			fortress: BEZIER_DEFAULT,
			barren: BEZIER_DEFAULT,
		});
	const [world, setWorld] = useState(generateWorld(mapSize, spawnRates));

	const onGenerateClick = () => setWorld(generateWorld(mapSize, spawnRates))
		, onMapSizeChange = e => {
			const size = +e.target.value;
			setMapSize(size);
			setWorld(generateWorld(size, spawnRates));
		};

	const onBezierInput = key => values => setSpawnRates(old => ({
		...old,
		[key]: values,
	}));

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
									<strong>Biome:</strong> {biome}<br/>
									<strong>Resource:</strong> {resource}<br/>
									<strong>Mob:</strong> {mob}
								</>
							)}>
								<span className={css.cell}>
									{RESOURCE[resource].icon ? (
										<>{RESOURCE[resource].icon}<small>{BIOME[biome].icon}</small></>
									) : BIOME[biome].icon}
									<span>{Array.from(
										{length:difficulty},
										(_, i) => <i key={i} />
									)}</span>
								</span>
							</Tooltip>
						);
					})}
				</div>
			</div>
			<div>
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
				<BezierInput
					label="Fortress Spawn"
					onInput={onBezierInput('fortress')}
					defaultValue={spawnRates.fortress}
				/>
				<BezierInput
					label="Barren Spawn"
					onInput={onBezierInput('barren')}
					defaultValue={spawnRates.barren}
				/>
			</div>
		</div>
	);
}
