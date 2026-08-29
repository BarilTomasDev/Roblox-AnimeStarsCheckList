
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
      { id: "w3-stats-soon", name: "Stat Upgrades", type: "soon" },
      { id: "w3-haki-soon", name: "Haki Specializations", type: "soon" },
    ],
  },
  worldIndexStub(4, "Titan Wall", "🧱"),
  worldIndexStub(5, "Solo City", "🏙️"),
  worldIndexStub(6, "Slayer Village", "⚔️"),
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
