import css from './style.module.scss';
import Button from '../../components/Button';
import { useState } from 'react';
import Tooltip from '../../components/Tooltip';
import Input from '../../components/Input';
import cls from '../../util/cls';
import randomFromArray from '../../util/random';

const BIOME = {
	'FOREST': { weight: 0.44, icon: '🌳' },
	'MOUNTAIN': { weight: 0.04, icon: '🏔' },
	'DESERT': { weight: 0.04, icon: '🏜' },
	'LAKE': { weight: 0.04, icon: '💧' },
	'PLAINS': { weight: 0.44, icon: '🌾' },
};

const RESOURCE = {
	'BARREN': { type: 'EMPTY', icon: '', biome: null },
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

		resource.biome.forEach(biome => {
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

function generateWorld (mapSize = 5) {
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
			const resource = Math.random() > 0.15
				? randomFromArray(RESOURCE_BY_BIOME[biome])
				: 'BARREN';
			const mob = randomFromArray(MOB_BY_BIOME[biome]);

			world.push({ x, y, difficulty, biome, resource, mob });
		}
	}

	return world;
}

export default function World () {
	const [mapSize, setMapSize] = useState(4);
	const [world, setWorld] = useState(generateWorld(mapSize));

	const onGenerateClick = () => setWorld(generateWorld(mapSize))
		, onMapSizeChange = e => {
			const size = +e.target.value;
			setMapSize(size);
			setWorld(generateWorld(size));
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
			</div>
		</div>
	);
}
