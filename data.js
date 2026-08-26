/*
  Checklist data.
  To add content: duplicate a "world" or "category" block and edit the fields.

  Entry types available inside a category:
    - type: "check"  -> simple checkbox (pet, quest, achievement...)
        { id, name, rarity? }
        rarity (optional): "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythical" | "divine" | "secret"

    - type: "level"   -> numeric progress (e.g. upgrade level 1 -> 100)
        { id, name, max }
        (current value is stored separately, defaults to 0)

    - type: "tier"    -> rarity ladder where only the best drop counts (e.g. gacha)
        { id, name, rarity }
        Items MUST be ordered from weakest to strongest.
        Click the best item obtained: everything below lights up with it,
        no independent checkboxes.
*/

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
          { id: "w1-gacha-1", name: "Common Item", rarity: "common" },
          { id: "w1-gacha-2", name: "Uncommon Item", rarity: "uncommon" },
          { id: "w1-gacha-3", name: "Rare Item", rarity: "rare" },
          { id: "w1-gacha-4", name: "Epic Item", rarity: "epic" },
          { id: "w1-gacha-5", name: "Legendary Item", rarity: "legendary" },
          { id: "w1-gacha-6", name: "Mythical Item", rarity: "mythical" },
          { id: "w1-gacha-7", name: "Secret Item", rarity: "secret" },
          { id: "w1-gacha-8", name: "Divine Item", rarity: "divine" },
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
        ],
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
