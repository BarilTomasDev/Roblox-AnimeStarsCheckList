const RARITY_TIERS = [
  { rarity: "common", name: "Common" },
  { rarity: "uncommon", name: "Uncommon" },
  { rarity: "rare", name: "Rare" },
  { rarity: "epic", name: "Epic" },
  { rarity: "legendary", name: "Legendary" },
  { rarity: "mythical", name: "Mythical" },
  { rarity: "secret", name: "Secret" },
  { rarity: "divine", name: "Divine" },
];

const SWORD_RARITY_TIERS = RARITY_TIERS.slice(0, 7);

function extendByStep(base, step, extraCount) {
  const last = base[base.length - 1];
  const extra = Array.from({ length: extraCount }, (_, i) => Math.round((last + step * (i + 1)) * 100) / 100);
  return [...base, ...extra];
}

function extendByRatio(base, ratio, extraCount) {
  const extra = [];
  let last = base[base.length - 1];
  for (let i = 0; i < extraCount; i++) {
    last = Math.round(last * ratio);
    extra.push(last);
  }
  return [...base, ...extra];
}

const TRIAL_SHARD_COSTS = extendByRatio(
  [
    25, 28, 31, 34, 37, 41, 46, 50, 56, 61, 68, 75, 83, 92, 101, 112, 124, 136,
    151, 167, 184, 203, 225, 248, 275, 303, 335, 370, 409, 452, 500, 552, 610,
    674, 745, 823, 910, 1000, 1100, 1200,
  ],
  1.1,
  10
);

function trialLevels(values) {
  return values.map((value, i) => ({ value, cost: TRIAL_SHARD_COSTS[i] }));
}

const TRIAL_MULT_BASE = [
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5,
  1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0,
  3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0,
];
const TRIAL_XP_DROP_BASE = [
  0.03, 0.05, 0.08, 0.1, 0.12, 0.15, 0.18, 0.2, 0.23, 0.25, 0.28, 0.3, 0.33,
  0.35, 0.38, 0.4, 0.43, 0.45, 0.48, 0.5, 0.53, 0.55, 0.58, 0.6, 0.62, 0.65,
  0.68, 0.7, 0.73, 0.75, 0.78, 0.8, 0.83, 0.85, 0.88, 0.9, 0.93, 0.95, 0.98,
  1.0,
];
const TRIAL_LUCK_BASE = [
  0.1, 0.3, 0.4, 0.6, 0.8, 0.9, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 1.9, 2.1, 2.2,
  2.4, 2.5, 2.7, 2.9, 3.0, 3.1, 3.3, 3.4, 3.6, 3.8, 3.9, 4.0, 4.2, 4.3, 4.5,
  4.6, 4.8, 5.0, 5.1, 5.2, 5.4, 5.6, 5.7, 5.9, 6.0,
];

const TRIAL_MULT_VALUES = extendByStep(TRIAL_MULT_BASE, 0.1, 10);
const TRIAL_XP_DROP_VALUES = extendByStep(TRIAL_XP_DROP_BASE, 0.025, 10);
const TRIAL_LUCK_VALUES = extendByStep(TRIAL_LUCK_BASE, 0.15, 10);

const WANO_MULT_VALUES = extendByStep(TRIAL_MULT_BASE, 0.1, 20);
const WANO_XP_DROP_VALUES = extendByStep(TRIAL_XP_DROP_BASE, 0.025, 20);
const WANO_LUCK_VALUES = extendByStep(TRIAL_LUCK_BASE, 0.15, 20);

const W9_DUNGEON_COIN_COSTS = [
  25, 28, 32, 37, 42, 48, 55, 63, 71, 81, 93, 106, 120, 137, 157, 178, 203,
  232, 264, 301, 344, 392, 447, 509, 580, 662, 754, 860, 980, 1100, 1300,
  1500, 1700, 1900, 2200, 2500, 2800, 3200, 3600, 4100, 4700, 5400, 6100,
  7000, 8000, 9100, 10400, 11800, 13500, 15400, ...new Array(10).fill(null),
];

function professionLevels(costs, values) {
  return costs.map((cost, i) => ({ cost, value: values[i] }));
}

function noCostLevels(values) {
  return values.map((value) => ({ value, cost: null }));
}

function linearLevels(step, count) {
  return Array.from({ length: count }, (_, i) => Math.round(step * (i + 1) * 1000) / 1000);
}
const W6_POWER_VALUES = linearLevels(0.1, 60);
const W6_XP_DROP_VALUES = linearLevels(1.5 / 60, 60);
const W6_LUCK_VALUES = linearLevels(9.0 / 60, 60);

const PROF_PERCENT_VALUES = Array.from({ length: 25 }, (_, i) => (i + 1) * 10);
const PROF_COINS_VALUES = Array.from({ length: 25 }, (_, i) => Math.round((i + 1) * 10) / 100);
const PROF_GACHA_SPEED_VALUES = Array.from({ length: 25 }, (_, i) => i + 1);

const PROF_POWER_COSTS = [
  50, 64.5, 83.2, 107.3, 138.7, 178.6, 230.4, 299.3, 383.4, 499.8, 638.1,
  821.1, 1100, 1390, 1800, 2300, 2900, 3800, 4900, 6300, 8100, 10500, 13600,
  17500, 22500,
];
const PROF_DAMAGE_COSTS = [
  500, 680, 924.8, 1300, 1700, 2300, 3200, 4300, 5900, 8000, 10800, 14700,
  20000, 27200, 37000, 50400, 68500, 93100, 126700, 172300, 234300, 318600,
  433300, 589300, 801500,
];
const PROF_LUCK_COSTS = [
  250, 355, 504.1, 718, 1020, 1400, 2000, 2900, 4100, 5900, 8300, 11800,
  16800, 23900, 33900, 48100, 68300, 97000, 137800, 195600, 277800, 394500,
  560100, 795400, 1100000,
];
const PROF_COINS_COSTS = [
  500, 705, 994, 1400, 2000, 2800, 3900, 5500, 7800, 11000, 15500, 21900,
  30860, 43510, 61400, 86500, 121970, 172100, 242600, 342100, 482300, 680100,
  958900, 1400000, 1900000,
];
const PROF_GACHA_SPEED_COSTS = [
  50, 60, 72, 103.7, 124.4, 149.3, 179.2, 215.0, 258.0, 309.6, 371.5, 445.8,
  535.0, 642.0, 770.4, 924.4, 1100, 1300, 1600, 1900, 2300, 2800, 3300, 4000,
  4800,
];

const INDEX_MILESTONE_REWARDS = [...new Array(13).fill(""), "+5% Power"];

const W3_YEN_COSTS = [
  200e6, 830e6, 3.4e9, 14.3e9, 59.3e9, 246.2e9, 1e12, 4.2e12, 17.6e12, 73e12,
  303e12, 1.3e15, 5.2e15, 21.7e15, 89.9e15, 373e15, 1.5e18, 6.4e18, 26.7e18,
  110.6e18, 459.2e18, 1.9e21, 7.9e21, 32.8e21, 136.2e21, 565.2e21, 2.3e24,
  9.7e24, 40.4e24, 167.7e24, 695.8e24, 2.9e27, 12e27, 49.7e27, 206.4e27,
  856.5e27, 3.6e30, 14.8e30, 61.2e30, 254e30, ...new Array(20).fill(null),
];

const SKILL_TREE_COSTS = [
  150, 275, 525, 1100, 2100, 4200, 8400, 16800, 33600, 67200, 134400, 268800,
  536700,
];
const SKILL_TREE_MULT = [
  1.05, 1.1, 1.2, 1.3, 1.4, 1.55, 1.7, 1.85, 2.05, 2.3, 2.55, 2.85, 3.15,
];
const SKILL_TREE_POWER_MULT = [...SKILL_TREE_MULT.slice(0, 11), 3.2, ...SKILL_TREE_MULT.slice(12)];
const SKILL_TREE_XP = [
  1.05, 1.1, 1.15, 1.25, 1.35, 1.45, 1.55, 1.7, 1.85, 2, 2.15, 2.35, 2.55,
];
const SKILL_TREE_DROP = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3];
const SKILL_TREE_LUCK = [
  0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25,
];

const ELIXIR_MULT = [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5];
const ELIXIR_COSTS = [
  400, 2100, 5400, 11475, 22275, 41006, 72900, 126435, 215282, 361367,
  599716, 986072, 1608854, 2607901, 4200000,
];
const GENOS_EXTRA_POWER = [1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5];

function comboLevels(costs, parts) {
  return costs.map((cost, i) => ({
    cost,
    value: parts.map((p) => ({ label: p.label, unit: p.unit, value: p.values[i] })),
  }));
}

const OBS_HAKI_COSTS = [
  2500, 3000, 3800, 4900, 6200, 7900, 10100, 12900, 16400, 21000, 26700,
  34100, 43400, 55400, 70600, 90000, 114800, 146300, 186600, 237900, 303300,
  386700, 493000, 628600, 801400,
];
const OBS_HAKI_PCT = [
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170,
  180, 190, 200, 210, 220, 230, 240, 250,
];

const ARM_HAKI_COSTS = [
  5000, 7500, 9700, 12500, 16100, 20800, 26800, 34600, 44600, 57500, 74200,
  95700, 123500, 159300, 205500, 265000, 341900, 441100, 569000, 734000,
  946800, 1200000, 1600000, 2000000, 2600000,
];
const ARM_HAKI_DAMAGE_PCT = OBS_HAKI_PCT;
const ARM_HAKI_DROP = [
  0, 0.1, 0.1, 0.2, 0.2, 0.2, 0.3, 0.3, 0.4, 0.4, 0.4, 0.5, 0.5, 0.6, 0.6, 0.6,
  0.7, 0.7, 0.8, 0.8, 0.8, 0.9, 0.9, 1, 1,
];

const CONQ_HAKI_COSTS = [
  500, 1000, 1200, 1500, 1900, 2400, 2900, 3600, 4500, 5600, 6900, 8600,
  10700, 13200, 16400, 20300, 25200, 31300, 38800, 48100, 59600, 73900,
  91700, 113600, 140900,
];
const CONQ_HAKI_LUCK = [
  0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3, 3.2,
  3.4, 3.6, 3.8, 4, 4.2, 4.4, 4.6, 4.8, 5.0,
];
const CONQ_HAKI_YEN_PCT = OBS_HAKI_PCT;

const KI_EVOLUTION_VALUES = [
  1.25, 1.56, 1.95, 2.44, 3.05, 3.81, 4.77, 5.96, 7.45, 9.31, 11.64, 14.55,
  18.19, 22.74, 28.42, 35.53, 44.41, 55.51, 69.39, 86.74,
];
const KI_EVOLUTION_COSTS = [
  100, 170, 289, 491, 835, 1400, 2400, 4100, 7000, 11900, 20200, 34300, 58300,
  99000, 168400, 286200, 486600, 827100, 1406000, 2390000,
];

const PROMOTION_RANKS = [
  {
    stats: [],
    missions: ["Reach Level 2", "Defeat 100 enemies", "Reach Rank 1"],
  },
  {
    stats: ["+10% Power", "+5% Damage", "+5% Yen", "+2 Walkspeed"],
    missions: ["Reach Rank 2", "Reach Range Level 2", "Defeat 750 Enemies", "Roll 250 Doujutsu Gacha"],
  },
  {
    stats: ["+20% Power", "+10% Damage", "+10% Yen", "+0.1 Luck", "+2 Walkspeed"],
    missions: ["Reach Player Level 10", "Reach Rank 4", "Summon 2500 Pets in Ninja Village", "Obtain any accessory", "Defeat Itachi 500 Times"],
  },
  {
    stats: ["+30% Power", "+15% Damage", "+15% Yen", "+0.1 Luck", "+5% XP", "+2 Walkspeed"],
    missions: ["Reach Player Level 15", "Reach Rank 6", "Complete 1 Side Quest", "Complete 1 Map Index", "Join Ninja Raid 5x", "Clear Waves in Ninja Raid"],
  },
  {
    stats: ["+40% Power", "+20% Damage", "+20% Yen", "+0.2 Luck", "+5% XP", "+0.05 Drop", "+2.25 Walkspeed"],
    missions: ["Reach Player Level 20", "Reach Rank 8", "Reach Range Level 4", "Roll Races Gacha: 500", "Summon Pets in Namek City: 7500", "Defeat Enemies: 3000"],
  },
  {
    stats: ["+55% Power", "+25% Damage", "+30% Yen", "+0.2 Luck", "+10% XP", "+0.05 Drop", "+2.5 Walkspeed"],
    missions: ["Reach Player Level 25", "Reach Rank 10", "Reach Range Level 5", "Complete 2 Side Quests", "Complete 2 Index Maps", "Reach Dragon Relic Level 25", "Complete 1 Ninja Raid"],
  },
  {
    stats: ["+70% Power", "+30% Damage", "+40% Yen", "+0.3 Luck", "+10% XP", "+0.1 Drop", "+2.75 Walkspeed"],
    missions: ["Reach Player Level 30", "Reach Rank 12", "Reach Range Level 6", "Roll 2,500 Haki Gacha", "Summon 12,500 Pets in World 3", "Defeat 6,000 Enemies"],
  },
  {
    stats: ["+85% Power", "+35% Damage", "+50% Yen", "+0.3 Luck", "+15% XP", "+0.1 Drop", "+3 Walkspeed"],
    missions: ["Reach Player Level 35", "Reach Rank 14", "Reach Range Level 7", "Defeat White Beard 1,500 Times", "Complete 3 Index Maps", "Obtain 3 Accessories"],
  },
  {
    stats: ["+100% Power", "+40% Damage", "+60% Yen", "+0.5 Luck", "+15% XP", "+0.1 Drop", "+3.25 Walkspeed"],
    missions: ["Reach Player Level 40", "Reach Rank 16", "Reach Range Level 8", "Join Titan Defense 25 Times"],
  },
  {
    stats: ["+120% Power", "+50% Damage", "+70% Yen", "+0.5 Luck", "+25% XP", "+0.1 Drop", "+3.5 Walkspeed"],
    missions: ["Reach Player Level 45", "Reach Rank 18", "Defeat 12,000 Enemies", "Defeat 2,000 Armored Titans", "Clear 500 Waves in Titan Defense"],
  },
  {
    stats: ["+140% Power", "+60% Damage", "+80% Yen", "+0.75 Luck", "+25% XP", "+0.15 Drop", "+3.75 Walkspeed", "+1% CritChance", "+5% CritDamage"],
    missions: ["Reach Player Level 20", "Reach Rank 20", "Reach Range Level 10", "Complete 4 Side Quests", "Reach Level 50 Titan Relic", "Complete 10 Titan Defense"],
  },
  {
    stats: ["+160% Power", "+70% Damage", "+90% Yen", "+0.75 Luck", "+35% XP", "+0.15 Drop", "+4 Walkspeed", "+1% CritChance", "+10% CritDamage"],
    missions: ["Reach Player Level 55", "Reach Rank 22", "Reach Range Level 11", "Roll Hunter Gacha 5,000 Times", "Summon Solo City Pets 35,000 Times"],
  },
  {
    stats: ["+180% Power", "+80% Damage", "+100% Yen", "+1 Luck", "+35% XP", "+0.15 Drop", "+4.25 Walkspeed", "+2% CritChance", "+10% CritDamage"],
    missions: ["Reach Player Level 60", "Reach Rank 24", "Reach Range Level 12", "Defeat 20,000 Enemies", "Defeat W5 World Boss 3,000 Times"],
  },
  {
    stats: ["+200% Power", "+90% Damage", "+110% Yen", "+1 Luck", "+45% XP", "+0.2 Drop", "+4.5 Walkspeed", "+2% CritChance", "+15% CritDamage"],
    missions: ["Reach Player Level 65", "Reach Rank 26", "Reach Range Level 13", "Complete 5 Map Index", "Obtain 6 of Any Accessory"],
  },
  {
    stats: ["+220% Power", "+100% Damage", "+120% Yen", "+1.25 Luck", "+45% XP", "+0.2 Drop", "+4.75 Walkspeed", "+2% CritChance", "+20% CritDamage"],
    missions: ["Reach Player Level 70", "Reach Rank 28", "Reach Range Level 14", "Roll 10,000 Demon Moon Gacha", "Summon 75,000 Pets in W6", "Reach Slayer Relic Level 25"],
  },
  {
    stats: ["+240% Power", "+110% Damage", "+130% Yen", "+1.25 Luck", "+60% XP", "+0.25 Drop", "+5 Walkspeed", "+2% CritChance", "+20% CritDamage"],
    missions: ["Reach Player Level 75", "Reach Rank 30", "Reach Range Level 15", "Defeat 35,000 Enemies", "Defeat W6 World Boss 4,000 Times", "Join Infinity Castle 50 Times"],
  },
  {
    stats: ["+260% Power", "+120% Damage", "+140% Yen", "+1.5 Luck", "+60% XP", "+0.25 Drop", "+5.25 Walkspeed", "+3% CritChance", "+25% CritDamage"],
    missions: ["Reach Player Level 80", "Reach Rank 32", "Reach Range Level 16", "Roll 1,200 Magic Attributes Gacha", "Summon 5,000 Pets in Clover Island", "Join Clover Raid 1 Time"],
  },
  {
    stats: ["+280% Power", "+130% Damage", "+150% Yen", "+1.5 Luck", "+75% XP", "+0.3 Drop", "+5.5 Walkspeed", "+3% CritChance", "+30% CritDamage"],
    missions: ["Reach Player Level 90", "Reach Rank 34", "Reach Range Level 18", "Roll 25,000 World 7 Gacha", "Summon 150,000 Pets in World 7", "Join Clover Raid 100 Times"],
  },
  {
    stats: ["+300% Power", "+140% Damage", "+160% Yen", "+1.75 Luck", "+75% XP", "+0.3 Drop", "+5.75 Walkspeed", "+3% CritChance", "+30% CritDamage"],
    missions: ["Reach Player Level 100", "Reach Rank 36", "Reach Range Level 20", "Defeat 50,000 Enemies", "Defeat World 7 World Boss 5,000 Times", "Complete 7 Map Index", "Obtain 7 of Any Accessory", "Complete Clover Raid 5 Times"],
  },
  {
    stats: ["+325% Power", "+150% Damage", "+170% Yen", "+1.75 Luck", "+90% XP", "+0.35 Drop", "+6 Walkspeed", "+3% CritChance", "+35% CritDamage"],
    missions: ["Reach Player Level 110", "Reach Rank 38", "Reach Range Level 21", "Roll 50,000 W8 (SAO) Gacha", "Summon 300,000 Pets in W8 (SAO)", "Join Beach Defense 100 Times"],
  },
  {
    stats: ["+350% Power", "+160% Damage", "+180% Yen", "+2 Luck", "+90% XP", "+0.35 Drop", "+6.25 Walkspeed", "+4% CritChance", "+35% CritDamage"],
    missions: ["Reach Player Level 120", "Reach Rank 40", "Reach Range Level 22", "Defeat 70,000 Enemies", "Defeat Quinella 6,000 Times", "Complete 8 Map Index", "Clear 2,500 Beach Defense Waves"],
  },
  {
    stats: ["+375% Power", "+175% Damage", "+190% Yen", "+2 Luck", "+110% XP", "+0.4 Drop", "+6.5 Walkspeed", "+4% CritChance", "+40% CritDamage"],
    missions: ["Reach Player Level 130", "Reach Rank 43", "Reach Range Level 23", "Roll 100,000 W9 (Fire City) Gacha", "Summon 500,000 Pets in W9 (Fire City)", "Join Fire City Dungeons 15 Times"],
  },
  {
    stats: ["+400% Power", "+190% Damage", "+200% Yen", "+2.25 Luck", "+110% XP", "+0.4 Drop", "+6.75 Walkspeed", "+4% CritChance", "+40% CritDamage"],
    missions: ["Reach Player Level 135", "Reach Rank 45", "Reach Range Level 24", "Defeat 90,000 Enemies", "Defeat Sho 7,500 Times", "Clear 500 Fire City Dungeon Waves"],
  },
  {
    stats: ["+430% Power", "+205% Damage", "+215% Yen", "+2.25 Luck", "+130% XP", "+0.45 Drop", "+7 Walkspeed", "+4% CritChance", "+45% CritDamage"],
    missions: ["Reach Player Level 140", "Reach Rank 47", "Reach Range Level 25", "Complete 9 Side Quests", "Complete 9 Map Index", "Obtain 12 of Any Accessory", "Complete Fire Dungeon 5 Times"],
  },
  {
    stats: ["+465% Power", "+225% Damage", "+230% Yen", "+2.5 Luck", "+130% XP", "+0.45 Drop", "+7.25 Walkspeed", "+5% CritChance", "+45% CritDamage"],
    missions: ["Reach Player Level 145", "Reach Rank 49", "Reach Range Level 26", "Roll 150,000 Soul Artifact Gacha (W10)", "Defeat 120,000 Enemies", "Summon 1,000,000 Pets in Hueco World", "Complete 10 Side Quests"],
  },
  {
    stats: ["+500% Power", "+250% Damage", "+250% Yen", "+2.5 Luck", "+150% XP", "+0.5 Drop", "+7.5 Walkspeed", "+5% CritChance", "+50% CritDamage"],
    missions: ["Reach Player Level 150", "Reach Rank 52", "Reach Range Level 28", "Defeat Ainz (World 10 WB) 10,000 Times", "Complete 10 Side Quests", "Obtain 15 Accessories", "Join 150 Soul Raids", "Complete 10,000 Soul Raid Waves"],
  },
  {
    stats: ["+540% Power", "+275% Damage", "+270% Yen", "+2.75 Luck", "+165% XP", "+0.55 Drop", "+7.75 Walkspeed", "+5% CritChance", "+50% CritDamage"],
    missions: ["Reach Player Level 155", "Reach Rank 54", "Roll 175,000 Innate Technique Gacha", "Defeat 115,000 Enemies", "Complete 11 Index Maps"],
  },
  {
    stats: ["+585% Power", "+300% Damage", "+295% Yen", "+2.75 Luck", "+180% XP", "+0.55 Drop", "+8 Walkspeed", "+6% CritChance", "+55% CritDamage"],
    missions: ["Reach Player Level 150 (was 160 before)", "Reach Rank 52 (was 57 before)", "Complete 11 Side Quests", "Obtain 20 of Any Accessory", "Roll 7,000 Innate Technique Gacha (W11) (was 200,000 before)", "Summon 28,000 Pets in W11 (was 1,250,000 before)"],
  },
  {
    stats: ["+630% Power", "+325% Damage", "+320% Yen", "+3 Luck", "+200% XP", "+0.6 Drop", "+8.25 Walkspeed", "+6% CritChance", "+55% CritDamage"],
    missions: ["Reach Player Level 155", "Reach Rank 54", "Join Cursed Rush V1 3 Times", "Complete 600 Cursed Rush V1 Waves", "Defeat Sukuna (World 11 World Boss) 2,000 Times", "Defeat 13,000 Enemies"],
  },
  {
    stats: ["+690% Power", "+350% Damage", "+345% Yen", "+3.25 Luck", "+220% XP", "+0.6 Drop", "+8.5 Walkspeed", "+6% CritChance", "+60% CritDamage", "+1 Pet Slot"],
    missions: ["Reach Player Level 160", "Reach Rank 57", "Obtain 8 Accessories", "Complete 12 Side Quests", "Roll 9,000 Gacha in W12", "Open 36,000 Stars in W12"],
  },
  {
    stats: ["+750% Power", "+375% Damage", "+370% Yen", "+3.5 Luck", "+240% XP", "+0.65 Drop", "+8.75 Walkspeed", "+7% CritChance", "+60% CritDamage", "+2 Pet Slots"],
    missions: ["Reach Player Level 165", "Reach Rank 60", "Join Sins Raid 3 Times", "Clear 300 Waves in Sins Raid", "Defeat Zeldris (Sins Raid Boss) 5,000 Times", "Defeat Arthur (W12 WB) 3,200 Times"],
  },
  {
    stats: ["+815% Power", "+400% Damage", "+395% Yen", "+3.75 Luck", "+260% XP", "+0.65 Drop", "+9 Walkspeed", "+7% CritChance", "+65% CritDamage", "+0.25% Shiny Chance", "+2 Pet Slots"],
    missions: ["Reach Player Level 170", "Reach Rank 64", "Complete 13 Side Quests", "Obtain 9 of Any Accessory", "Roll 11,000 W13 Gacha", "Summon 45,000 Pets in World 13"],
  },
  {
    stats: ["+885% Power", "+425% Damage", "+420% Yen", "+4 Luck", "+280% XP", "+0.7 Drop", "+9.25 Walkspeed", "+8% CritChance", "+65% CritDamage", "+0.50% Shiny Chance"],
    missions: ["Reach Player Level 185", "Reach Rank 76", "Join Hero Defense 250 Times", "Clear 10,000 Waves at Hero Defense", "Defeat Monster Garou 25,000 Times", "Defeat Cosmic Garou 10,000 Times"],
  },
  {
    stats: ["+960% Power", "+450% Damage", "+445% Yen", "+4.25 Luck", "+300% XP", "+0.7 Drop", "+9.25 Walkspeed", "+8% CritChance", "+70% CritDamage", "+0.50% Shiny Chance", "+2 Pet Slots"],
    missions: ["Reach Player Level 190", "Reach Rank 72", "Complete 14 Side Quests", "Obtain 10 of Any Accessory", "Roll 14,000 Spirits (W14) Gacha", "Summon 55,000 Pets in Tempest Federation"],
  },
  {
    stats: ["+1040% Power", "+480% Damage", "+475% Yen", "+4.25 Luck", "+320% XP", "+0.75 Drop", "+9.5 Walkspeed", "+8.5% CritChance", "+70% CritDamage", "+0.75% Shiny Chance", "+2 Pet Slots"],
    missions: ["Reach Player Level 200", "Reach Rank 76", "Defeat 18,000 Enemies", "Defeat Velgrynd 7,500 Times", "Defeat Rudra 4,000 Times", "Complete 14 Index Maps"],
  },
  {
    stats: ["+1130% Power", "+510% Damage", "+505% Yen", "+4.25 Luck", "+340% XP", "+0.75 Drop", "+9.5 Walkspeed", "+8.5% CritChance", "+70% CritDamage", "+0.75% Shiny Chance", "+2 Pet Slots"],
    missions: ["Reach Player Level 210", "Reach Rank 80", "Complete 15 Side Quests", "Obtain 12 of Any Accessory", "Roll 17,000 W15 Gacha", "Summon 65,000 Pets in W15"],
  },
  {
    stats: [],
    missions: ["Reach Player Level 220", "Reach Rank 84", "Defeat 22,000 Enemies in World 15", "Defeat Hisoka 9,000 Times", "Defeat Chrollo 5,000 Times", "Complete 15 Map Index"],
  },
  {
    stats: ["+1310% Power", "+570% Damage", "+565% Yen", "+4.75 Luck", "+380% XP", "+0.8 Drop", "+9.75 Walkspeed", "+9% CritChance", "+80% CritDamage", "+1% Shiny Chance", "+2 Pet Slots"],
    missions: ["Reach Player Level 225", "Reach Rank 88", "Complete 16 Side Quests", "Obtain 14 of Any Accessory", "Roll 20,000 W16 Gacha", "Summon 75,000 Pets in W16"],
  },
  {
    stats: ["+1410% Power", "+600% Damage", "+595% Yen", "+4.75 Luck", "+400% XP", "+0.85 Drop", "+10 Walkspeed", "+9.5% CritChance", "+80% CritDamage", "+1.25% Shiny Chance", "+2 Pet Slots"],
    missions: ["Reach Player Level 230", "Reach Rank 92", "Join Owl Suppression 5 Times", "Clear 500 Waves in Owl Suppression", "Defeat Eto 7,000 Times", "Defeat Arima 4,000 Times", "Complete 16 Index Maps"],
  },
];

function worldIndexStub(n, name, icon) {
  return {
    id: `world-${n}`,
    name: `W${n} - ${name}`,
    icon,
    section: "worlds",
    categories: [
      {
        id: `w${n}-pets`,
        name: "Pets (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: `w${n}-pets-count`, name: "Pets", max: 9 }],
      },
      {
        id: `w${n}-avatars`,
        name: "Avatars (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: `w${n}-avatars-count`, name: "Avatars", max: 7 }],
      },
      {
        id: `w${n}-index`,
        name: "Index Milestones",
        type: "index",
        sources: [`w${n}-pets`, `w${n}-avatars`],
        count: 14,
        rewards: INDEX_MILESTONE_REWARDS,
      },
      { id: `world-${n}-soon`, name: `World ${n}`, type: "soon" },
    ],
  };
}

const CHECKLIST_DATA = [
  {
    id: "world-0",
    name: "W0 - Lobby",
    icon: "🏠",
    section: "worlds",
    categories: [
      {
        id: "lobby-gacha",
        name: "Gacha",
        type: "tier",
        items: [
          { id: "lobby-gacha-cosmic-scale", name: "Cosmic Scale" },
        ],
      },
      {
        id: "lobby-sword-gacha",
        name: "Sword Gacha (Optional)",
        type: "tier",
        tiers: SWORD_RARITY_TIERS,
        glued: true,
        excludeFromProgress: true,
        items: [
          { id: "lobby-dual-sword-gamepass", name: "Dual Sword Gamepass", type: "check" },
          { id: "lobby-sword-1", name: "Sword" },
          { id: "lobby-sword-2", name: "Sword (Dual)", requires: "lobby-dual-sword-gamepass" },
        ],
      },
      {
        id: "lobby-range",
        name: "Range Upgrade (Optional)",
        type: "level",
        excludeFromProgress: true,
        items: [
          { id: "lobby-up-range", name: "Range", max: 32 },
        ],
      },
      {
        id: "lobby-upgrades",
        name: "Upgrades",
        type: "scale",
        items: [
          { id: "lobby-stat-power", name: "Power", unit: "x", color: "#a366e8", levels: trialLevels(TRIAL_MULT_VALUES) },
          { id: "lobby-stat-yen", name: "Yen", unit: "x", color: "#f2c94c", levels: trialLevels(TRIAL_MULT_VALUES) },
          { id: "lobby-stat-luck", name: "Luck", unit: "Luck", color: "#4ade80", levels: trialLevels(TRIAL_LUCK_VALUES) },
          { id: "lobby-stat-damage", name: "Damage", unit: "x", color: "#e5484d", levels: trialLevels(TRIAL_MULT_VALUES) },
          { id: "lobby-stat-drop", name: "Drop", unit: "x", color: "#5b8cff", levels: trialLevels(TRIAL_XP_DROP_VALUES) },
          { id: "lobby-stat-xp", name: "XP", unit: "x", color: "#e5548c", levels: trialLevels(TRIAL_XP_DROP_VALUES) },
        ],
      },
      {
        id: "lobby-professions",
        name: "Professions",
        type: "scale",
        items: [
          {
            id: "lobby-prof-power",
            name: "Power",
            unit: "%",
            color: "#a366e8",
            costUnit: "Global Raid Waves",
            levels: professionLevels(PROF_POWER_COSTS, PROF_PERCENT_VALUES),
          },
          {
            id: "lobby-prof-damage",
            name: "Damage",
            unit: "%",
            color: "#e5484d",
            costUnit: "Kills",
            levels: professionLevels(PROF_DAMAGE_COSTS, PROF_PERCENT_VALUES),
          },
          {
            id: "lobby-prof-luck",
            name: "Luck",
            unit: "%",
            color: "#4ade80",
            costUnit: "Gacha Rolls",
            levels: professionLevels(PROF_LUCK_COSTS, PROF_PERCENT_VALUES),
          },
          {
            id: "lobby-prof-coins",
            name: "Coins",
            unit: "x",
            color: "#f2c94c",
            costUnit: "Star Spins",
            levels: professionLevels(PROF_COINS_COSTS, PROF_COINS_VALUES),
          },
          {
            id: "lobby-prof-gacha-speed",
            name: "Gacha Speed",
            unit: "%",
            color: "#5b8cff",
            costUnit: "Global Defense Waves",
            levels: professionLevels(PROF_GACHA_SPEED_COSTS, PROF_GACHA_SPEED_VALUES),
          },
        ],
      },
    ],
  },
  {
    id: "world-1",
    name: "W1 - Ninja Village",
    icon: "🥷",
    section: "worlds",
    categories: [
      {
        id: "w1-pets",
        name: "Pets (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w1-pets-count", name: "Pets", max: 9 }],
      },
      {
        id: "w1-avatars",
        name: "Avatars (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w1-avatars-count", name: "Avatars", max: 7 }],
      },
      {
        id: "w1-index",
        name: "Index Milestones",
        type: "index",
        sources: ["w1-pets", "w1-avatars"],
        count: 14,
        rewards: INDEX_MILESTONE_REWARDS,
      },
      {
        id: "w1-gacha",
        name: "Gacha",
        type: "tier",
        items: [
          { id: "w1-gacha-doujutsu", name: "Doujutsu" },
        ],
      },
      {
        id: "w1-ranks",
        name: "Ranks",
        type: "check",
        items: [
          { id: "w1-auto-rank-up", name: "Auto Rank Up" },
        ],
      },
      {
        id: "w1-avatars-automation",
        name: "Avatars",
        type: "check",
        items: [
          { id: "w1-auto-equip-best", name: "Auto Equip Best" },
        ],
      },
      {
        id: "w1-medal-event",
        name: "Medal Event (Optional)",
        type: "check",
        excludeFromProgress: true,
        items: [{ id: "w1-medal-event-done", name: "Medal Event" }],
      },
      {
        id: "w1-upgrades",
        name: "Upgrades",
        type: "level",
        items: [
          { id: "w1-up-progression", name: "Ninja Progression", max: 100 },
        ],
      },
    ],
  },
  {
    id: "world-2",
    name: "W2 - Namek City",
    icon: "🌌",
    section: "worlds",
    categories: [
      {
        id: "w2-pets",
        name: "Pets (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w2-pets-count", name: "Pets", max: 9 }],
      },
      {
        id: "w2-avatars",
        name: "Avatars (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w2-avatars-count", name: "Avatars", max: 7 }],
      },
      {
        id: "w2-index",
        name: "Index Milestones",
        type: "index",
        sources: ["w2-pets", "w2-avatars"],
        count: 14,
        rewards: INDEX_MILESTONE_REWARDS,
      },
      {
        id: "w2-gacha",
        name: "Gacha",
        type: "tier",
        items: [
          { id: "w2-gacha-races", name: "Races" },
          { id: "w2-gacha-divine-techniques", name: "Divine Techniques" },
        ],
      },
      {
        id: "w2-passives",
        name: "Passives",
        type: "level",
        items: [
          { id: "w2-passive-damage", name: "Damage", max: 8, color: "#e5484d" },
          { id: "w2-passive-yen", name: "Yen", max: 8, color: "#f2c94c" },
          { id: "w2-passive-luck", name: "Luck", max: 8, color: "#4ade80" },
          { id: "w2-passive-power", name: "Power", max: 8, color: "#a366e8" },
        ],
      },
      {
        id: "w2-upgrades",
        name: "Upgrades",
        type: "level",
        items: [
          { id: "w2-up-ki-progression", name: "Ki Progression", max: 100 },
        ],
      },
      {
        id: "w2-ki-evolution",
        name: "Ki Evolution",
        type: "scale",
        items: [
          {
            id: "w2-up-ki-evolution",
            name: "Ki Evolution",
            unit: "x",
            color: "#a366e8",
            costUnit: "Shards",
            levels: professionLevels(KI_EVOLUTION_COSTS, KI_EVOLUTION_VALUES),
          },
        ],
      },
    ],
  },
  {
    id: "world-3",
    name: "W3 - Wano Island",
    icon: "🏯",
    section: "worlds",
    categories: [
      {
        id: "w3-pets",
        name: "Pets (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w3-pets-count", name: "Pets", max: 9 }],
      },
      {
        id: "w3-avatars",
        name: "Avatars (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w3-avatars-count", name: "Avatars", max: 7 }],
      },
      {
        id: "w3-index",
        name: "Index Milestones",
        type: "index",
        sources: ["w3-pets", "w3-avatars"],
        count: 14,
        rewards: INDEX_MILESTONE_REWARDS,
      },
      {
        id: "w3-gacha",
        name: "Gacha",
        type: "tier",
        items: [
          { id: "w3-gacha-hakis", name: "Hakis" },
          { id: "w3-gacha-demon-fruits", name: "Demon Fruits" },
        ],
      },
      {
        id: "w3-upgrades",
        name: "Upgrades",
        type: "level",
        items: [
          { id: "w3-up-fruit-progression", name: "Fruit Progression", max: 100 },
        ],
      },
      {
        id: "w3-stats",
        name: "Stat Upgrades",
        type: "scale",
        items: [
          { id: "w3-stat-power", name: "Power", unit: "x", color: "#a366e8", costUnit: "Yen", levels: professionLevels(W3_YEN_COSTS, WANO_MULT_VALUES) },
          { id: "w3-stat-yen", name: "Yen", unit: "x", color: "#f2c94c", costUnit: "Yen", levels: professionLevels(W3_YEN_COSTS, WANO_MULT_VALUES) },
          { id: "w3-stat-luck", name: "Luck", unit: "Luck", color: "#4ade80", costUnit: "Yen", levels: professionLevels(W3_YEN_COSTS, WANO_LUCK_VALUES) },
          { id: "w3-stat-damage", name: "Damage", unit: "x", color: "#e5484d", costUnit: "Yen", levels: professionLevels(W3_YEN_COSTS, WANO_MULT_VALUES) },
          { id: "w3-stat-drop", name: "Drop", unit: "x", color: "#5b8cff", costUnit: "Yen", levels: professionLevels(W3_YEN_COSTS, WANO_XP_DROP_VALUES) },
          { id: "w3-stat-xp", name: "XP", unit: "x", color: "#e5548c", costUnit: "Yen", levels: professionLevels(W3_YEN_COSTS, WANO_XP_DROP_VALUES) },
        ],
      },
      {
        id: "w3-haki",
        name: "Haki Specializations",
        type: "scale",
        items: [
          {
            id: "w3-haki-observation",
            name: "Observation Haki",
            costUnit: "Kills",
            levels: comboLevels(OBS_HAKI_COSTS, [
              { label: "Power", unit: "%", values: OBS_HAKI_PCT },
              { label: "XP", unit: "%", values: OBS_HAKI_PCT },
            ]),
          },
          {
            id: "w3-haki-armament",
            name: "Armament Haki",
            costUnit: "Sword Rolls",
            levels: comboLevels(ARM_HAKI_COSTS, [
              { label: "Damage", unit: "%", values: ARM_HAKI_DAMAGE_PCT },
              { label: "Drop", unit: "Drop", values: ARM_HAKI_DROP },
            ]),
          },
          {
            id: "w3-haki-conqueror",
            name: "Conqueror Haki",
            costUnit: "Gamemode Waves",
            levels: comboLevels(CONQ_HAKI_COSTS, [
              { label: "Luck", unit: "Luck", values: CONQ_HAKI_LUCK },
              { label: "Yen", unit: "%", values: CONQ_HAKI_YEN_PCT },
            ]),
          },
        ],
      },
    ],
  },
  {
    id: "world-4",
    name: "W4 - Titan Wall",
    icon: "🧱",
    section: "worlds",
    categories: [
      {
        id: "w4-pets",
        name: "Pets (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w4-pets-count", name: "Pets", max: 9 }],
      },
      {
        id: "w4-avatars",
        name: "Avatars (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w4-avatars-count", name: "Avatars", max: 7 }],
      },
      {
        id: "w4-index",
        name: "Index Milestones",
        type: "index",
        sources: ["w4-pets", "w4-avatars"],
        count: 14,
        rewards: INDEX_MILESTONE_REWARDS,
      },
      {
        id: "w4-gacha",
        name: "Gacha",
        type: "tier",
        items: [
          { id: "w4-gacha-family", name: "Family" },
          { id: "w4-gacha-humanity-arsenal", name: "Humanity Arsenal" },
        ],
      },
      {
        id: "w4-titans",
        name: "Titans",
        type: "tier",
        glued: true,
        items: [
          { id: "w4-dual-titan-gamepass", name: "Dual Titan Gamepass", type: "check" },
          { id: "w4-titan-1", name: "Titan" },
          { id: "w4-titan-2", name: "Titan (Dual)", requires: "w4-dual-titan-gamepass" },
        ],
      },
      {
        id: "w4-upgrades",
        name: "Upgrades",
        type: "level",
        items: [
          { id: "w4-up-dmt-progression", name: "DMT Progression", max: 100 },
        ],
      },
    ],
  },
  {
    id: "world-5",
    name: "W5 - Solo City",
    icon: "🏙️",
    section: "worlds",
    categories: [
      {
        id: "w5-pets",
        name: "Pets (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w5-pets-count", name: "Pets", max: 9 }],
      },
      {
        id: "w5-avatars",
        name: "Avatars (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w5-avatars-count", name: "Avatars", max: 7 }],
      },
      {
        id: "w5-index",
        name: "Index Milestones",
        type: "index",
        sources: ["w5-pets", "w5-avatars"],
        count: 14,
        rewards: INDEX_MILESTONE_REWARDS,
      },
      {
        id: "w5-gacha",
        name: "Gacha",
        type: "tier",
        items: [
          { id: "w5-gacha-hunter-class", name: "Hunter Class" },
          { id: "w5-gacha-powerful-monarchs", name: "Powerful Monarchs" },
        ],
      },
      {
        id: "w5-upgrades",
        name: "Upgrades",
        type: "level",
        items: [
          { id: "w5-up-mana-progression", name: "Mana Progression", max: 100 },
        ],
      },
      {
        id: "w5-skill-tree",
        name: "Skill Tree",
        type: "scale",
        items: [
          { id: "w5-skill-power", name: "Power", unit: "x", color: "#a366e8", costUnit: "Leveling Coins", levels: professionLevels(SKILL_TREE_COSTS, SKILL_TREE_POWER_MULT) },
          { id: "w5-skill-yen", name: "Yen", unit: "x", color: "#f2c94c", costUnit: "Leveling Coins", levels: professionLevels(SKILL_TREE_COSTS, SKILL_TREE_MULT) },
          { id: "w5-skill-luck", name: "Luck", unit: "Luck", color: "#4ade80", costUnit: "Leveling Coins", levels: professionLevels(SKILL_TREE_COSTS, SKILL_TREE_LUCK) },
          { id: "w5-skill-damage", name: "Damage", unit: "x", color: "#e5484d", costUnit: "Leveling Coins", levels: professionLevels(SKILL_TREE_COSTS, SKILL_TREE_MULT) },
          { id: "w5-skill-drop", name: "Drop", unit: "Drop", color: "#5b8cff", costUnit: "Leveling Coins", levels: professionLevels(SKILL_TREE_COSTS, SKILL_TREE_DROP) },
          { id: "w5-skill-xp", name: "XP", unit: "x", color: "#e5548c", costUnit: "Leveling Coins", levels: professionLevels(SKILL_TREE_COSTS, SKILL_TREE_XP) },
        ],
      },
      {
        id: "w5-elixir",
        name: "Elixir of Life",
        type: "scale",
        items: [
          { id: "w5-elixir-crafted", name: "Elixir of Life Crafted?", type: "check" },
          {
            id: "w5-elixir-level",
            name: "Elixir of Life",
            unit: "x",
            color: "#e5484d",
            costUnit: "Kills",
            requires: "w5-elixir-crafted",
            levels: professionLevels(ELIXIR_COSTS, ELIXIR_MULT),
          },
        ],
      },
    ],
  },
  {
    id: "world-6",
    name: "W6 - Slayer Village",
    icon: "⚔️",
    section: "worlds",
    categories: [
      {
        id: "w6-pets",
        name: "Pets (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w6-pets-count", name: "Pets", max: 9 }],
      },
      {
        id: "w6-avatars",
        name: "Avatars (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w6-avatars-count", name: "Avatars", max: 7 }],
      },
      {
        id: "w6-index",
        name: "Index Milestones",
        type: "index",
        sources: ["w6-pets", "w6-avatars"],
        count: 14,
        rewards: INDEX_MILESTONE_REWARDS,
      },
      {
        id: "w6-gacha",
        name: "Gacha",
        type: "tier",
        items: [
          { id: "w6-gacha-demon-moons", name: "Demon Moons" },
          { id: "w6-gacha-nichirin-saya", name: "Nichirin Saya" },
        ],
      },
      {
        id: "w6-upgrades",
        name: "Upgrades",
        type: "level",
        items: [
          { id: "w6-up-slayer-progression", name: "Slayer Progression", max: 100 },
        ],
      },
      {
        id: "w6-stats",
        name: "Stat Upgrades",
        type: "scale",
        items: [
          { id: "w6-stat-power", name: "Power", unit: "x", color: "#a366e8", levels: noCostLevels(W6_POWER_VALUES) },
          { id: "w6-stat-yen", name: "Yen", unit: "x", color: "#f2c94c", levels: noCostLevels(W6_POWER_VALUES) },
          { id: "w6-stat-luck", name: "Luck", unit: "Luck", color: "#4ade80", levels: noCostLevels(W6_LUCK_VALUES) },
          { id: "w6-stat-damage", name: "Damage", unit: "x", color: "#e5484d", levels: noCostLevels(W6_POWER_VALUES) },
          { id: "w6-stat-drop", name: "Drop", unit: "x", color: "#5b8cff", levels: noCostLevels(W6_XP_DROP_VALUES) },
          { id: "w6-stat-xp", name: "XP", unit: "x", color: "#e5548c", levels: noCostLevels(W6_XP_DROP_VALUES) },
        ],
      },
      {
        id: "w6-battlepass",
        name: "Battle Pass",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w6-battlepass-level", name: "Battle Pass", max: 30 }],
      },
    ],
  },
  {
    id: "world-7",
    name: "W7 - Clover Island",
    icon: "🍀",
    section: "worlds",
    categories: [
      {
        id: "w7-pets",
        name: "Pets (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w7-pets-count", name: "Pets", max: 9 }],
      },
      {
        id: "w7-avatars",
        name: "Avatars (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w7-avatars-count", name: "Avatars", max: 7 }],
      },
      {
        id: "w7-index",
        name: "Index Milestones",
        type: "index",
        sources: ["w7-pets", "w7-avatars"],
        count: 14,
        rewards: INDEX_MILESTONE_REWARDS,
      },
      {
        id: "w7-gacha",
        name: "Gacha",
        type: "tier",
        items: [
          { id: "w7-gacha-magic-attributes", name: "Magic Attributes" },
        ],
      },
      {
        id: "w7-grimoire",
        name: "Grimoire",
        type: "tier",
        items: [
          { id: "w7-gacha-grimoire-1", name: "Grimoire 1" },
          { id: "w7-gacha-grimoire-2", name: "Grimoire 2" },
        ],
      },
      {
        id: "w7-upgrades",
        name: "Upgrades",
        type: "level",
        items: [
          { id: "w7-up-magic-progression", name: "Magic Progression", max: 100 },
        ],
      },
      {
        id: "w7-battlepass",
        name: "Battle Pass",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w7-battlepass-level", name: "Battle Pass", max: 30 }],
      },
    ],
  },
  {
    id: "world-8",
    name: "W8 - Summer Art Online",
    icon: "🏖️",
    section: "worlds",
    categories: [
      {
        id: "w8-pets",
        name: "Pets (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w8-pets-count", name: "Pets", max: 9 }],
      },
      {
        id: "w8-avatars",
        name: "Avatars (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w8-avatars-count", name: "Avatars", max: 7 }],
      },
      {
        id: "w8-index",
        name: "Index Milestones",
        type: "index",
        sources: ["w8-pets", "w8-avatars"],
        count: 14,
        rewards: INDEX_MILESTONE_REWARDS,
      },
      {
        id: "w8-gacha",
        name: "Gacha",
        type: "tier",
        items: [
          { id: "w8-gacha-races-sao", name: "Races SAO" },
        ],
      },
      {
        id: "w8-sword-gacha",
        name: "Summer Swords (Optional)",
        type: "tier",
        glued: true,
        excludeFromProgress: true,
        items: [
          { id: "w8-dual-sword-gamepass", name: "Dual Sword Gamepass", type: "check" },
          { id: "w8-sword-1", name: "Sword" },
          { id: "w8-sword-2", name: "Sword (Dual)", requires: "w8-dual-sword-gamepass" },
        ],
      },
      {
        id: "w8-upgrades",
        name: "Upgrades",
        type: "level",
        items: [
          { id: "w8-up-summer-progression", name: "Summer Progression", max: 100 },
        ],
      },
      {
        id: "w8-battlepass",
        name: "Battle Pass",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w8-battlepass-level", name: "Battle Pass", max: 30 }],
      },
    ],
  },
  {
    id: "world-9",
    name: "W9 - Fire City",
    icon: "🔥",
    section: "worlds",
    categories: [
      {
        id: "w9-pets",
        name: "Pets (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w9-pets-count", name: "Pets", max: 9 }],
      },
      {
        id: "w9-avatars",
        name: "Avatars (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w9-avatars-count", name: "Avatars", max: 7 }],
      },
      {
        id: "w9-index",
        name: "Index Milestones",
        type: "index",
        sources: ["w9-pets", "w9-avatars"],
        count: 14,
        rewards: INDEX_MILESTONE_REWARDS,
      },
      {
        id: "w9-gacha",
        name: "Gacha",
        type: "tier",
        items: [
          { id: "w9-gacha-battalion", name: "Battalion" },
          { id: "w9-gacha-frame-cores", name: "Flame Cores" },
        ],
      },
      {
        id: "w9-upgrades",
        name: "Upgrades",
        type: "level",
        items: [
          { id: "w9-up-fire-progression", name: "Fire Progression", max: 100 },
        ],
      },
      {
        id: "w9-stats",
        name: "Stat Upgrades",
        type: "scale",
        items: [
          {
            id: "w9-titan-equip",
            name: "+1 Titan Equip",
            unit: "Slot",
            color: "#f2994a",
            costUnit: "Dungeon Coins",
            levels: professionLevels([55000], [1]),
          },
          { id: "w9-stat-power", name: "Power", unit: "x", color: "#a366e8", costUnit: "Dungeon Coins", levels: professionLevels(W9_DUNGEON_COIN_COSTS, WANO_MULT_VALUES) },
          { id: "w9-stat-yen", name: "Yen", unit: "x", color: "#f2c94c", costUnit: "Dungeon Coins", levels: professionLevels(W9_DUNGEON_COIN_COSTS, WANO_MULT_VALUES) },
          { id: "w9-stat-luck", name: "Luck", unit: "Luck", color: "#4ade80", costUnit: "Dungeon Coins", levels: professionLevels(W9_DUNGEON_COIN_COSTS, WANO_LUCK_VALUES) },
          { id: "w9-stat-damage", name: "Damage", unit: "x", color: "#e5484d", costUnit: "Dungeon Coins", levels: professionLevels(W9_DUNGEON_COIN_COSTS, WANO_MULT_VALUES) },
          { id: "w9-stat-drop", name: "Drop", unit: "x", color: "#5b8cff", costUnit: "Dungeon Coins", levels: professionLevels(W9_DUNGEON_COIN_COSTS, WANO_XP_DROP_VALUES) },
          { id: "w9-stat-xp", name: "XP", unit: "x", color: "#e5548c", costUnit: "Dungeon Coins", levels: professionLevels(W9_DUNGEON_COIN_COSTS, WANO_XP_DROP_VALUES) },
        ],
      },
    ],
  },
  {
    id: "world-10",
    name: "W10 - Hueco World",
    icon: "🌑",
    section: "worlds",
    categories: [
      {
        id: "w10-pets",
        name: "Pets (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w10-pets-count", name: "Pets", max: 9 }],
      },
      {
        id: "w10-avatars",
        name: "Avatars (Index)",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w10-avatars-count", name: "Avatars", max: 7 }],
      },
      {
        id: "w10-index",
        name: "Index Milestones",
        type: "index",
        sources: ["w10-pets", "w10-avatars"],
        count: 14,
        rewards: INDEX_MILESTONE_REWARDS,
      },
      {
        id: "w10-gacha",
        name: "Gacha",
        type: "tier",
        items: [
          { id: "w10-gacha-soul-artifacts", name: "Soul Artifacts" },
        ],
      },
      {
        id: "w10-upgrades",
        name: "Upgrades",
        type: "level",
        items: [
          { id: "w10-up-hueco-progression", name: "Hueco Progression", max: 100 },
        ],
      },
      {
        id: "w10-stats",
        name: "Stat Upgrades",
        type: "scale",
        items: [
          { id: "w10-stat-power", name: "Power", unit: "x", color: "#a366e8", levels: noCostLevels(W6_POWER_VALUES) },
          { id: "w10-stat-yen", name: "Yen", unit: "x", color: "#f2c94c", levels: noCostLevels(W6_POWER_VALUES) },
          { id: "w10-stat-luck", name: "Luck", unit: "Luck", color: "#4ade80", levels: noCostLevels(W6_LUCK_VALUES) },
          { id: "w10-stat-damage", name: "Damage", unit: "x", color: "#e5484d", levels: noCostLevels(W6_POWER_VALUES) },
          { id: "w10-stat-drop", name: "Drop", unit: "x", color: "#5b8cff", levels: noCostLevels(W6_XP_DROP_VALUES) },
          { id: "w10-stat-xp", name: "XP", unit: "x", color: "#e5548c", levels: noCostLevels(W6_XP_DROP_VALUES) },
        ],
      },
      {
        id: "w10-zanpakuto",
        name: "Zanpakuto",
        type: "scale",
        items: [
          { id: "w10-zanpakuto-crafted", name: "Zanpakuto Crafted?", type: "check" },
          {
            id: "w10-zanpakuto-level",
            name: "Zanpakuto",
            unit: "x",
            color: "#a366e8",
            costUnit: "Kills",
            requires: "w10-zanpakuto-crafted",
            levels: professionLevels(ELIXIR_COSTS, ELIXIR_MULT),
          },
        ],
      },
      {
        id: "w10-battlepass",
        name: "Battle Pass",
        type: "level",
        excludeFromProgress: true,
        items: [{ id: "w10-battlepass-level", name: "Battle Pass", max: 50 }],
      },
    ],
  },
  worldIndexStub(11, "Cursed School", "👹"),
  {
    id: "global-achievements",
    name: "Achievements",
    icon: "🏆",
    section: "general",
    categories: [
      {
        id: "achievements-raids",
        name: "Raids",
        type: "check",
        items: [
          { id: "raid-lobby-1", name: "Lobby - Raid" },
          { id: "raid-w1-1", name: "Ninja Raid" },
          { id: "raid-w1-2", name: "Tomb Raid" },
          { id: "raid-w4-1", name: "Titan Wall Defense" },
          { id: "raid-w6-1", name: "Infinite Castle" },
          { id: "raid-w7-1", name: "Clover Raid" },
          { id: "raid-w10-1", name: "Soul Raid" },
        ],
      },
    ],
  },
  {
    id: "global-gamepasses",
    name: "Gamepasses Priority",
    icon: "🎫",
    section: "general",
    sourceNote: {
      text: "This priority order is extracted from a Discord message and isn't an official or nominative ranking.",
      url: "https://discord.com/channels/1340825930326741054/1510459899577110570/1532186514623303750",
    },
    categories: [
      {
        id: "gamepasses-priority",
        name: "Priority Order",
        type: "priority",
        tiers: [
          { label: "S", color: "#e5484d" },
          { label: "A", color: "#f2994a" },
          { label: "B", color: "#ffd700" },
          { label: "C", color: "#4ade80" },
          { label: "D", color: "#5b8cff" },
          { label: "X", color: "#6b6f7a" },
        ],
        items: [
          { id: "gp-1", rank: 1, tier: "S", name: "Remote Star", color: "#ffd700", image: "https://tr.rbxcdn.com/180DAY-b2000c3696b838db5246d7845b0ff713/420/420/Image/Png/noFilter" },
          { id: "lobby-dual-sword-gamepass", rank: 2, tier: "S", name: "+1 Sword Equip", color: "#5b8cff", image: "https://tr.rbxcdn.com/180DAY-1a03244f238aa88ed2d3c76e400ac58a/420/420/Image/Png/noFilter" },
          { id: "gp-3", rank: 3, tier: "S", name: "2x Power", color: "#a366e8", image: "https://tr.rbxcdn.com/180DAY-47beb1ed959ccd961d05e9f1bb0edeae/420/420/Image/Png/noFilter" },
          { id: "gp-4", rank: 4, tier: "A", name: "More Drops (+5)", color: "#5b8cff", image: "https://tr.rbxcdn.com/180DAY-6455e7b7295b78be3e61307e40ca873e/420/420/Image/Png/noFilter" },
          { id: "gp-5", rank: 5, tier: "A", name: "VIP", subtitle: "Note 1", color: "#ffd700", image: "https://tr.rbxcdn.com/180DAY-94f9d197a110129462030031f1ba130e/420/420/Image/Png/noFilter" },
          { id: "gp-6", rank: 6, tier: "A", name: "Fast Click", color: "#5b8cff", image: "https://tr.rbxcdn.com/180DAY-db077aef073d4a55d2a986632c2027c4/420/420/Image/Png/noFilter" },
          { id: "gp-7", rank: 7, tier: "A", name: "Z City Battle Pass" },
          { id: "gp-8", rank: 8, tier: "A", name: "Bleach Battle Pass" },
          { id: "gp-9", rank: 9, tier: "B", name: "Summer Battle Pass" },
          { id: "gp-10", rank: 10, tier: "B", name: "2x Damage", color: "#e5484d", image: "https://tr.rbxcdn.com/180DAY-9d2be5b53c3bb94719bbb39ecb37326d/420/420/Image/Png/noFilter" },
          { id: "gp-11", rank: 11, tier: "B", name: "+2 Pet Equip", color: "#5b8cff", image: "https://tr.rbxcdn.com/180DAY-a4eb024b3a9d702ef386275ae5e405c7/420/420/Image/Png/noFilter" },
          { id: "gp-12", rank: 12, tier: "B", name: "Fast Hatch", color: "#ffd700", image: "https://tr.rbxcdn.com/180DAY-fa8f8f38777d4c9f3f393280847220d0/420/420/Image/Png/noFilter" },
          { id: "gp-13", rank: 13, tier: "B", name: "Clover Battle Pass", subtitle: "Note 2" },
          { id: "gp-14", rank: 14, tier: "C", name: "Fast Gacha", color: "#d7d8de", image: "https://tr.rbxcdn.com/180DAY-3011fa7a28e094429a6546badef2e373/420/420/Image/Png/noFilter" },
          { id: "gp-15", rank: 15, tier: "C", name: "Multi Open", color: "#ffd700", image: "https://tr.rbxcdn.com/180DAY-7ad518329a595af596162516d01cc942/420/420/Image/Png/noFilter" },
          { id: "gp-16", rank: 16, tier: "C", name: "+1 Shadow Equip", color: "#5b8cff", image: "https://tr.rbxcdn.com/180DAY-7d942851fb6208e3efd3ab00b575fda7/420/420/Image/Png/noFilter" },
          { id: "gp-17", rank: 17, tier: "C", name: "2x Yen", color: "#f2c94c", image: "https://tr.rbxcdn.com/180DAY-306b2049d4d3a87a77fcea1a42bc05eb/420/420/Image/Png/noFilter" },
          { id: "gp-18", rank: 18, tier: "C", name: "+1 Gacha Open", color: "#d7d8de", image: "https://tr.rbxcdn.com/180DAY-1422218040b44d53424fc07ec975e32d/420/420/Image/Png/noFilter" },
          { id: "gp-19", rank: 19, tier: "D", name: "Luck", color: "#4ade80", image: "https://tr.rbxcdn.com/180DAY-8050112726243661c5a4597441106b19/420/420/Image/Png/noFilter" },
          { id: "gp-20", rank: 20, tier: "D", name: "Ultra Luck", color: "#a366e8", image: "https://tr.rbxcdn.com/180DAY-e7d8d628bee11fcbaecee4d0ee5a5e1a/420/420/Image/Png/noFilter" },
          { id: "gp-21", rank: 21, tier: "D", name: "Super Luck", color: "#ffd700", image: "https://tr.rbxcdn.com/180DAY-00f54970c8b30e0bd425aadbd18a4d82/420/420/Image/Png/noFilter" },
          { id: "gp-22", rank: 22, tier: "D", name: "Big Storage", color: "#f2994a", image: "https://tr.rbxcdn.com/180DAY-bc62c2af6d3b9f5c1c6ea590c13b1a35/420/420/Image/Png/noFilter" },
          { id: "gp-2x-exp", tier: "X", name: "2x Exp", color: "#e5548c", image: "https://tr.rbxcdn.com/180DAY-8650edfd6959ce3939bfa70fcd4eea1c/420/420/Image/Png/noFilter" },
        ],
      },
    ],
  },
  {
    id: "global-quests",
    name: "Global Quests",
    icon: "🗺️",
    section: "general",
    categories: [{ id: "global-quests-soon", name: "Global Quests", type: "soon" }],
  },
  {
    id: "global-promotions",
    name: "Promotions",
    icon: "🎖️",
    section: "general",
    sourceNote: {
      text: "This rank/mission data is extracted from a Discord message and isn't an official or nominative ranking.",
      url: "https://discord.com/channels/1340825930326741054/1529249282228621312",
    },
    categories: [
      {
        id: "promotions-ranks",
        name: "Promotions",
        type: "promotion",
        ranks: PROMOTION_RANKS,
      },
    ],
  },
  {
    id: "global-relics",
    name: "Relics",
    icon: "🏺",
    section: "general",
    categories: [{ id: "relics-soon", name: "Relics", type: "soon" }],
  },
  {
    id: "global-titles",
    name: "Titles",
    icon: "👑",
    section: "general",
    hideNavPercent: true,
    categories: [
      {
        id: "titles-list",
        name: "Titles (Optional)",
        type: "check",
        excludeFromProgress: true,
        singleColumn: true,
        items: [
          { id: "w1-medal-event-done", name: "Medal Partner", color: "#ffd700", subtitle: "+2.5x Power, +1.75x Damage, +1.25x Yen, +0.75x Drop" },
          { id: "title-uchiha-prodigy", name: "Uchiha Prodigy", color: "#e5484d", subtitle: "+1 Luck" },
          { id: "title-berserker-saiyan", name: "The Berserker Saiyan", color: "#4ade80", subtitle: "+1.5x Yen" },
          { id: "title-strongest-man", name: "The Strongest Man in the World", color: "#d4af37", subtitle: "+1.5x Damage" },
          { id: "title-armored-titan", name: "The Armored Titan", color: "#f2994a", subtitle: "+1.5x Power" },
          { id: "title-shadow-army", name: "Grand Marshal of the Shadow Army", color: "#a366e8", subtitle: "+0.25x Drop" },
          { id: "title-upper-moon-one", name: "Upper Moon One", color: "#9b59d0", subtitle: "+2.5 Luck" },
          { id: "title-host-astaroth", name: "Host of Astaroth", color: "#7dd3fc", subtitle: "+2x Yen" },
          { id: "title-administrator", name: "The Administrator", color: "#ff4fd8", subtitle: "+2x Damage" },
          { id: "title-third-pillar", name: "Third Pillar", color: "#f2994a", subtitle: "+2x Power" },
          { id: "title-false-god", name: "False God", color: "#a366e8", subtitle: "+0.5x Drop" },
          { id: "title-king-of-curses", name: "King of Curses", color: "#e5484d", subtitle: "+2.25x Power, +1.5x Yen" },
          { id: "title-cursed-incarnation", name: "Cursed Incarnation", color: "#dc2626", subtitle: "+2.5x Power, +1.75x Damage" },
          { id: "title-king-of-chaos", name: "King Of Chaos", color: "#6b21a8", subtitle: "+2.5x Damage, +0.75x Drop" },
          { id: "title-cosmic-terror", name: "Cosmic Terror", color: "#a366e8", subtitle: "+3x Power, +2x Yen" },
          { id: "title-the-absolute", name: "The Absolute", color: "#c0c0c0", subtitle: "+3.5x Power, +2.5x Damage, +0.5x Drop" },
          { id: "title-fallen-emperor", name: "Fallen Emperor", color: "#b91c1c", subtitle: "+3.25x Power, +3x Damage, +2.5x Yen" },
          { id: "title-head-of-spider", name: "The Head of the Spider", color: "#7c3aed", subtitle: "+4x Power, +3.25x Damage, +3.5x Yen" },
        ],
      },
    ],
  },
];
