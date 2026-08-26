/*
  Structure des données de la checklist.
  Pour ajouter du contenu : dupliquer un bloc "world" ou "category" et changer les champs.

  Types d'entrées possibles dans une catégorie :
    - type: "check"  -> simple case à cocher (pet, item de gacha, succès...)
        { id, name, rarity? }
        rarity (optionnel) : "common" | "rare" | "epic" | "legendary" | "mythic" | "secret"

    - type: "level"   -> progression numérique (ex: upgrade niveau 1 -> 100)
        { id, name, max }
        (la valeur actuelle est stockée séparément, 0 par défaut)

    - type: "tier"    -> échelle de rareté où seul le meilleur obtenu compte (ex: gacha)
        { id, name, rarity }
        Les items DOIVENT être classés du plus faible au plus fort.
        On clique sur le meilleur item obtenu : tout ce qui est en dessous
        s'allume avec, pas de cases à cocher indépendantes.
*/

const CHECKLIST_DATA = [
  {
    id: "world-0",
    name: "Monde 0 — Lobby",
    icon: "🏠",
    categories: [
      {
        id: "lobby-quests",
        name: "Quêtes",
        type: "check",
        items: [
          { id: "lobby-q1", name: "Terminer le tutoriel" },
          { id: "lobby-q2", name: "Débloquer le monde 1" },
        ],
      },
      {
        id: "lobby-upgrades",
        name: "Upgrades",
        type: "level",
        items: [
          { id: "lobby-up-strength", name: "Force", max: 100 },
        ],
      },
    ],
  },
  {
    id: "world-1",
    name: "Monde 1 — Ninja Village",
    icon: "🥷",
    categories: [
      {
        id: "w1-gacha",
        name: "Gacha",
        type: "tier",
        items: [
          { id: "w1-gacha-1", name: "Item Commun", rarity: "common" },
          { id: "w1-gacha-2", name: "Item Rare", rarity: "rare" },
          { id: "w1-gacha-3", name: "Item Épique", rarity: "epic" },
          { id: "w1-gacha-4", name: "Item Légendaire", rarity: "legendary" },
        ],
      },
      {
        id: "w1-pets",
        name: "Pets (Index)",
        type: "check",
        items: [
          { id: "w1-pet-1", name: "Pet Commun", rarity: "common" },
          { id: "w1-pet-2", name: "Pet Rare", rarity: "rare" },
          { id: "w1-pet-3", name: "Pet Secret", rarity: "secret" },
        ],
      },
      {
        id: "w1-upgrades",
        name: "Upgrades",
        type: "level",
        items: [
          { id: "w1-up-level", name: "Niveau du joueur", max: 100 },
        ],
      },
    ],
  },
];
