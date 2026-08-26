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

  A category can also skip "items" entirely and use:
    - type: "index"   -> auto-computed milestones, not manually checked
        { id, name, sources, count }
        "sources" lists the ids of "check" categories in the same world to
        add up (e.g. Pets + Avatars). Milestone N is reached once N combined
        entries from those categories are checked (milestone `count` doesn't
        require every possible entry, just `count` of them). Nothing here is
        clickable — it just reflects Pets/Avatars progress automatically.

  Any category can also set:
    excludeFromProgress: true
        Its own checkboxes/bars still work and still show their own X/Y
        count, but it's left out of the world %/global % totals. Use this
        for categories whose real value is only unlocking something else
        (e.g. Pets/Avatars index entries barely matter on their own — what
        matters is the Index Milestones they add up to, so Pets/Avatars are
        excluded and only Index Milestones counts toward progress).
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
