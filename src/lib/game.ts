import type { Rarity } from "./drinks";

export type Badge = {
  id: string;
  label: string;
  emoji: string;
  condition: (s: GameState) => boolean;
};

export type GameState = {
  points: number;
  spins: number;
  streak: number;
  lastSpinISO: string | null;
  rarityCounts: Record<Rarity, number>;
  history: { name: string; rarity: Rarity; at: string }[];
  badges: string[];
};

export const INITIAL_STATE: GameState = {
  points: 0,
  spins: 0,
  streak: 0,
  lastSpinISO: null,
  rarityCounts: { common: 0, rare: 0, epic: 0, legendary: 0 },
  history: [],
  badges: [],
};

export const BADGES: Badge[] = [
  { id: "first-sip",  label: "First Sip",       emoji: "🍸", condition: (s) => s.spins >= 1 },
  { id: "triple",     label: "Triple Threat",   emoji: "🔥", condition: (s) => s.streak >= 3 },
  { id: "five-alive", label: "High Five",       emoji: "✋", condition: (s) => s.spins >= 5 },
  { id: "rare-bird",  label: "Rare Bird",       emoji: "🦚", condition: (s) => s.rarityCounts.rare >= 1 },
  { id: "epic-soul",  label: "Epic Soul",       emoji: "💎", condition: (s) => s.rarityCounts.epic >= 1 },
  { id: "legend",     label: "Legend of the Bar", emoji: "👑", condition: (s) => s.rarityCounts.legendary >= 1 },
  { id: "century",    label: "Century Club",    emoji: "💯", condition: (s) => s.points >= 100 },
  { id: "marathon",   label: "Marathon Mixer",  emoji: "🏃", condition: (s) => s.spins >= 15 },
];

export const STORAGE_KEY = "johnny-cocktail-lottery-v1";

export function loadState(): GameState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    return { ...INITIAL_STATE, ...JSON.parse(raw) };
  } catch {
    return INITIAL_STATE;
  }
}

export function saveState(s: GameState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}
