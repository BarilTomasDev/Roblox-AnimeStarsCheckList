
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

const CHECKLIST_DATA = [
  {
    id: "world-0",
    name: "World 0 — Lobby",
    icon: "🏠",
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
          { id: "lobby-stat-damage", name: "Damage", unit: "x", color: "#e5484d", levels: trialLevels(TRIAL_MULT_VALUES) },
          { id: "lobby-stat-xp", name: "XP", unit: "x", color: "#e5548c", levels: trialLevels(TRIAL_XP_DROP_VALUES) },
          { id: "lobby-stat-drop", name: "Drop", unit: "x", color: "#5b8cff", levels: trialLevels(TRIAL_XP_DROP_VALUES) },
          { id: "lobby-stat-luck", name: "Luck", unit: "Luck", color: "#4ade80", levels: trialLevels(TRIAL_LUCK_VALUES) },
        ],
      },
      { id: "lobby-professions", name: "Professions", type: "soon" },
    ],
  },
  {
    id: "world-1",
    name: "World 1 — Ninja Village",
    icon: "🥷",
    categories: [
      {
        id: "w1-gacha",
        name: "Gacha",
        type: "tier",
        items: [
          { id: "w1-gacha-doujutsu", name: "Doujutsu" },
        ],
      },
      { id: "w1-passives", name: "Passives", type: "soon" },
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
];
