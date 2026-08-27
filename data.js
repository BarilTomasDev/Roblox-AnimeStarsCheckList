
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
        name: "Range Upgrade",
        type: "level",
        items: [
          { id: "lobby-up-range", name: "Range", max: 32 },
        ],
      },
      {
        id: "lobby-upgrades",
        name: "Upgrades",
        type: "stat",
        items: [
          { id: "lobby-stat-power", name: "Power" },
          { id: "lobby-stat-yen", name: "Yen" },
          { id: "lobby-stat-luck", name: "Luck" },
          { id: "lobby-stat-damage", name: "Damage" },
          { id: "lobby-stat-drop", name: "Drop" },
          { id: "lobby-stat-xp", name: "XP" },
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
      { id: "w1-ranks", name: "Ranks", type: "soon" },
      { id: "w1-passives", name: "Passives", type: "soon" },
      {
        id: "w1-pets",
        name: "Pets (Index)",
        type: "check",
        excludeFromProgress: true,
        items: [
          { id: "w1-pet-1", name: "Common Pet", rarity: "common" },
          { id: "w1-pet-2", name: "Uncommon Pet", rarity: "uncommon" },
          { id: "w1-pet-3", name: "Rare Pet", rarity: "rare" },
          { id: "w1-pet-4", name: "Epic Pet", rarity: "epic" },
          { id: "w1-pet-5", name: "Legendary Pet", rarity: "legendary" },
          { id: "w1-pet-6", name: "Mythical Pet", rarity: "mythical" },
          { id: "w1-pet-7", name: "Crafted Pet", rarity: "crafted" },
          { id: "w1-pet-8", name: "Secret Pet", rarity: "secret" },
          { id: "w1-pet-9", name: "Divine Pet", rarity: "divine" },
        ],
      },
      {
        id: "w1-avatars",
        name: "Avatars (Index)",
        type: "check",
        excludeFromProgress: true,
        items: [
          { id: "w1-avatar-1", name: "Common Avatar", rarity: "common" },
          { id: "w1-avatar-2", name: "Uncommon Avatar", rarity: "uncommon" },
          { id: "w1-avatar-3", name: "Rare Avatar", rarity: "rare" },
          { id: "w1-avatar-4", name: "Epic Avatar", rarity: "epic" },
          { id: "w1-avatar-5", name: "Legendary Avatar", rarity: "legendary" },
          { id: "w1-avatar-6", name: "Mythical Avatar", rarity: "mythical" },
          { id: "w1-avatar-7", name: "Secret Avatar", rarity: "secret" },
        ],
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
