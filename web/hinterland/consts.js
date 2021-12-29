export const DEFAULT_SPAWN_RATES = {
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

export const BIOME = {
	'FOREST': { weight: 0.44, icon: '🌳' },
	'MOUNTAIN': { weight: 0.04, icon: '🏔' },
	'DESERT': { weight: 0.04, icon: '🏜' },
	'LAKE': { weight: 0.04, icon: '💧' },
	'PLAINS': { weight: 0.44, icon: '🌾' },
};

export const RESOURCE = {
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

export const MOB = {
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
