/*
  Checklist data.
  To add content: duplicate a "world" or "category" block and edit the fields.

  Entry types available inside a category:
    - type: "check"  -> simple checkbox (pet, quest, achievement...)
        { id, name, rarity? }
        rarity (optional): "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythical" | "secret" | "divine" | "crafted"
        ("crafted" is a separate placeholder tier some pets use after Mythical
        instead of Secret/Divine — exact rules TBD)

    - type: "level"   -> numeric progress (e.g. upgrade level 1 -> 100)
        { id, name, max }
        (current value is stored separately, defaults to 0)

    - type: "tier"    -> named gacha banner, only the best drop counts
        { id, name }
        "name" is the banner's name (e.g. "Doujutsu"). Every banner uses
        the same rarity ladder (see RARITY_TIERS below): click the best
        item obtained on its bar and everything below lights up with it,
        no independent checkboxes.
*/

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

function indexMilestones(worldId, count = 14) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${worldId}-index-${i + 1}`,
    name: `Milestone ${i + 1}`,
  }));
}

const CHECKLIST_DATA = [
  {
    id: "world-0",
    name: "World 0 — Lobby",
    icon: "🏠",
    categories: [
      {
        id: "lobby-quests",
        name: "Quests",
        type: "check",
        items: [
          { id: "lobby-q1", name: "Finish the tutorial" },
          { id: "lobby-q2", name: "Unlock World 1" },
        ],
      },
      {
        id: "lobby-upgrades",
        name: "Upgrades",
        type: "level",
        items: [
          { id: "lobby-up-strength", name: "Strength", max: 100 },
        ],
      },
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
          { id: "w1-gacha-elemental", name: "Elemental" },
        ],
      },
      {
        id: "w1-pets",
        name: "Pets (Index)",
        type: "check",
        items: [
          { id: "w1-pet-1", name: "Common Pet", rarity: "common" },
          { id: "w1-pet-2", name: "Rare Pet", rarity: "rare" },
          { id: "w1-pet-3", name: "Secret Pet", rarity: "secret" },
          { id: "w1-pet-4", name: "Crafted Pet", rarity: "crafted" },
        ],
      },
      {
        id: "w1-avatars",
        name: "Avatars (Index)",
        type: "check",
        items: [
          { id: "w1-avatar-1", name: "Common Avatar", rarity: "common" },
          { id: "w1-avatar-2", name: "Rare Avatar", rarity: "rare" },
          { id: "w1-avatar-3", name: "Secret Avatar", rarity: "secret" },
        ],
      },
      {
        id: "w1-index",
        name: "Index Milestones",
        type: "check",
        items: indexMilestones("w1"),
      },
      {
        id: "w1-upgrades",
        name: "Upgrades",
        type: "level",
        items: [
          { id: "w1-up-level", name: "Player Level", max: 100 },
        ],
      },
    ],
  },
];
