export type Rarity = "common" | "rare" | "epic" | "legendary";

export type Drink = {
  name: string;
  emoji: string;
  color: string;
  rarity: Rarity;
  tagline: string;
  points: number;
};

export const RARITY_META: Record<
  Rarity,
  { label: string; glow: string; text: string; weight: number; mult: number }
> = {
  common:    { label: "Common",    glow: "#12e7ff", text: "text-cyan-200",  weight: 60, mult: 1 },
  rare:      { label: "Rare",      glow: "#c6ff3d", text: "text-lime-200",  weight: 25, mult: 2 },
  epic:      { label: "Epic",      glow: "#ff2e93", text: "text-pink-200",  weight: 12, mult: 4 },
  legendary: { label: "LEGENDARY", glow: "#ffd166", text: "text-amber-200", weight: 3,  mult: 10 },
};

export const DRINKS: Drink[] = [
  { name: "Mojito",         emoji: "🌿", color: "#5fd38a", rarity: "common",    tagline: "Lime. Mint. Go.",             points: 10 },
  { name: "Margarita",      emoji: "🍋", color: "#e8d35a", rarity: "common",    tagline: "Salt the rim of fate.",        points: 10 },
  { name: "Old Fashioned",  emoji: "🥃", color: "#c47a3b", rarity: "rare",      tagline: "A gentleman's gamble.",        points: 20 },
  { name: "Espresso Martini",emoji:"☕", color: "#3a2418", rarity: "rare",      tagline: "Wake up and party.",           points: 20 },
  { name: "Piña Colada",    emoji: "🥥", color: "#f2e3b5", rarity: "common",    tagline: "Beach brain activated.",       points: 10 },
  { name: "Negroni",        emoji: "🍊", color: "#c2213f", rarity: "rare",      tagline: "Bitter. Bold. Beautiful.",     points: 20 },
  { name: "Blue Lagoon",    emoji: "🌊", color: "#1ea6e0", rarity: "epic",      tagline: "Drink the ocean.",             points: 40 },
  { name: "Aperol Spritz",  emoji: "🍹", color: "#ff7a3c", rarity: "common",    tagline: "Sunset in a glass.",           points: 10 },
  { name: "Whiskey Sour",   emoji: "🍋", color: "#d69a3b", rarity: "common",    tagline: "Pucker up, cowboy.",           points: 10 },
  { name: "Dragon's Breath",emoji: "🐉", color: "#ff2e93", rarity: "epic",      tagline: "Spicy. Smoky. Unhinged.",      points: 40 },
  { name: "Johnny's Secret",emoji: "🃏", color: "#8a2be2", rarity: "legendary", tagline: "Even Johnny doesn't know.",    points: 100 },
  { name: "Tequila Shot",   emoji: "🌵", color: "#b8e05f", rarity: "common",    tagline: "No thoughts. Just salt.",      points: 10 },
  { name: "Cosmopolitan",   emoji: "💖", color: "#ff5a8a", rarity: "rare",      tagline: "Sex in the city, baby.",       points: 20 },
  { name: "Unicorn Fizz",   emoji: "🦄", color: "#f0a8ff", rarity: "legendary", tagline: "Glitter-infused and illegal in 3 states.", points: 100 },
];

export function pickWeightedIndex(rng: () => number = Math.random): number {
  const weights = DRINKS.map((d) => RARITY_META[d.rarity].weight);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < DRINKS.length; i++) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return DRINKS.length - 1;
}
