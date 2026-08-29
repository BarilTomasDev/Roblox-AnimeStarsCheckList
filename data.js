
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

const TRIAL_SHARD_COSTS = [
  25, 28, 31, 34, 37, 41, 46, 50, 56, 61, 68, 75, 83, 92, 101, 112, 124, 136,
  151, 167, 184, 203, 225, 248, 275, 303, 335, 370, 409, 452, 500, 552, 610,
  674, 745, 823, 910, 1000, 1100, 1200,
];

function trialLevels(values) {
  return values.map((value, i) => ({ value, cost: TRIAL_SHARD_COSTS[i] }));
}

const TRIAL_MULT_VALUES = [
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5,
  1.6, 1.7, 1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0,
  3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0,
];
const TRIAL_XP_DROP_VALUES = [
  0.03, 0.05, 0.08, 0.1, 0.12, 0.15, 0.18, 0.2, 0.23, 0.25, 0.28, 0.3, 0.33,
  0.35, 0.38, 0.4, 0.43, 0.45, 0.48, 0.5, 0.53, 0.55, 0.58, 0.6, 0.62, 0.65,
  0.68, 0.7, 0.73, 0.75, 0.78, 0.8, 0.83, 0.85, 0.88, 0.9, 0.93, 0.95, 0.98,
  1.0,
];
const TRIAL_LUCK_VALUES = [
  0.1, 0.3, 0.4, 0.6, 0.8, 0.9, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 1.9, 2.1, 2.2,
  2.4, 2.5, 2.7, 2.9, 3.0, 3.1, 3.3, 3.4, 3.6, 3.8, 3.9, 4.0, 4.2, 4.3, 4.5,
  4.6, 4.8, 5.0, 5.1, 5.2, 5.4, 5.6, 5.7, 5.9, 6.0,
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
  856.5e27, 3.6e30, 14.8e30, 61.2e30, 254e30,
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
          { id: "w3-stat-power", name: "Power", unit: "x", color: "#a366e8", costUnit: "Yen", levels: professionLevels(W3_YEN_COSTS, TRIAL_MULT_VALUES) },
          { id: "w3-stat-yen", name: "Yen", unit: "x", color: "#f2c94c", costUnit: "Yen", levels: professionLevels(W3_YEN_COSTS, TRIAL_MULT_VALUES) },
          { id: "w3-stat-luck", name: "Luck", unit: "Luck", color: "#4ade80", costUnit: "Yen", levels: professionLevels(W3_YEN_COSTS, TRIAL_LUCK_VALUES) },
          { id: "w3-stat-damage", name: "Damage", unit: "x", color: "#e5484d", costUnit: "Yen", levels: professionLevels(W3_YEN_COSTS, TRIAL_MULT_VALUES) },
          { id: "w3-stat-drop", name: "Drop", unit: "x", color: "#5b8cff", costUnit: "Yen", levels: professionLevels(W3_YEN_COSTS, TRIAL_XP_DROP_VALUES) },
          { id: "w3-stat-xp", name: "XP", unit: "x", color: "#e5548c", costUnit: "Yen", levels: professionLevels(W3_YEN_COSTS, TRIAL_XP_DROP_VALUES) },
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
  worldIndexStub(7, "Clover Island", "🍀"),
  worldIndexStub(8, "Summer Art Online", "🏖️"),
  worldIndexStub(9, "Fire City", "🔥"),
  worldIndexStub(10, "Hueco World", "🌑"),
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
          { id: "raid-w1-1", name: "World 1 - Raid 1" },
          { id: "raid-w1-2", name: "World 1 - Raid 2" },
          { id: "raid-w4-1", name: "World 4 - Raid" },
          { id: "raid-w6-1", name: "World 6 - Raid" },
        ],
      },
    ],
  },
  {
    id: "global-gamepasses",
    name: "Gamepasses Priority",
    icon: "🎫",
    section: "general",
    categories: [{ id: "gamepasses-soon", name: "Gamepasses", type: "soon" }],
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
    categories: [{ id: "promotions-soon", name: "Promotions", type: "soon" }],
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
