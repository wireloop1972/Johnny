"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Wheel from "./Wheel";
import Confetti from "./Confetti";
import JohnnyPop from "./JohnnyPop";
import { DRINKS, RARITY_META, pickWeightedIndex, type Drink } from "@/lib/drinks";
import {
  BADGES,
  INITIAL_STATE,
  loadState,
  saveState,
  type GameState,
} from "@/lib/game";

const SPIN_MS = 5200;
const STREAK_WINDOW_MS = 5 * 60 * 1000;

export default function Game() {
  const [size, setSize] = useState(320);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Drink | null>(null);
  const [resultIndex, setResultIndex] = useState<number | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [johnnyKey, setJohnnyKey] = useState(0);
  const [newBadge, setNewBadge] = useState<string | null>(null);
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  // responsive wheel size
  useEffect(() => {
    const onResize = () => {
      const w = Math.min(window.innerWidth - 24, 460);
      const h = window.innerHeight * 0.55;
      setSize(Math.max(260, Math.min(w, h, 460)));
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const unlockedBadges = useMemo(
    () => new Set(state.badges),
    [state.badges],
  );

  const spin = useCallback(() => {
    if (spinning) return;
    setResult(null);
    setResultIndex(null);

    const targetIdx = pickWeightedIndex();
    const n = DRINKS.length;
    const slice = (Math.PI * 2) / n;
    // Pointer is at top (angle = -PI/2). We want slice center at pointer.
    // Slice i spans [rotation + i*slice, rotation + (i+1)*slice].
    // Center = rotation + (i + 0.5) * slice. Set ≡ -PI/2 (mod 2PI).
    const currentMod = ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const desired = -Math.PI / 2 - (targetIdx + 0.5) * slice;
    const desiredMod = ((desired % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    let delta = desiredMod - currentMod;
    if (delta <= 0) delta += Math.PI * 2;
    const extraTurns = 5 + Math.floor(Math.random() * 2);
    const total = rotation + delta + extraTurns * Math.PI * 2;

    const start = performance.now();
    const from = rotation;
    setSpinning(true);

    if (navigator.vibrate) navigator.vibrate(15);

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / SPIN_MS);
      const eased = 1 - Math.pow(1 - p, 3);
      setRotation(from + (total - from) * eased);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setSpinning(false);
        const drink = DRINKS[targetIdx];
        setResult(drink);
        setResultIndex(targetIdx);
        applyWin(drink);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [rotation, spinning]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const applyWin = useCallback((drink: Drink) => {
    const meta = RARITY_META[drink.rarity];
    const now = new Date();
    const nowISO = now.toISOString();
    if (meta.mult >= 4 && navigator.vibrate) navigator.vibrate([40, 30, 80]);
    if (meta.mult >= 4) setConfettiKey((k) => k + 1);

    setState((prev) => {
      const withinWindow =
        prev.lastSpinISO &&
        now.getTime() - new Date(prev.lastSpinISO).getTime() < STREAK_WINDOW_MS;
      const streak = withinWindow ? prev.streak + 1 : 1;
      const streakBonus = Math.min(streak, 5);
      const earned = drink.points * streakBonus;
      const rarityCounts = {
        ...prev.rarityCounts,
        [drink.rarity]: prev.rarityCounts[drink.rarity] + 1,
      };
      const nextState: GameState = {
        points: prev.points + earned,
        spins: prev.spins + 1,
        streak,
        lastSpinISO: nowISO,
        rarityCounts,
        history: [
          { name: drink.name, rarity: drink.rarity, at: nowISO },
          ...prev.history,
        ].slice(0, 20),
        badges: prev.badges,
      };
      // compute newly-earned badges
      const freshly = BADGES.filter(
        (b) => !prev.badges.includes(b.id) && b.condition(nextState),
      );
      if (freshly.length) {
        nextState.badges = [...prev.badges, ...freshly.map((b) => b.id)];
        setNewBadge(freshly[0].label);
        setTimeout(() => setNewBadge(null), 3000);
      }
      return nextState;
    });
  }, []);

  const resetProgress = () => {
    if (!confirm("Reset your bar card? All points & badges gone.")) return;
    setState(INITIAL_STATE);
  };

  const resultMeta = result ? RARITY_META[result.rarity] : null;

  return (
    <main className="relative z-10 flex flex-col items-center gap-4 px-4 pt-4 pb-10 min-h-dvh">
      <header className="w-full max-w-md text-center pt-2">
        <p className="text-xs uppercase tracking-[0.3em] text-pink-300/80">
          Johnny's
        </p>
        <h1 className="font-display text-5xl sm:text-6xl neon-text leading-none">
          COCKTAIL
          <br />
          LOTTERY
        </h1>
        <p className="mt-1 text-xs text-white/60">
          Spin it. Sip it. Don't sue Johnny.
        </p>
      </header>

      <StatsBar state={state} />

      <div className="relative flex items-center justify-center mt-2">
        {/* Pointer */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 z-20"
          style={{
            width: 0,
            height: 0,
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderTop: "26px solid #ffd166",
            filter: "drop-shadow(0 0 10px rgba(255,209,102,0.9))",
          }}
        />
        <div
          className={`rounded-full p-1 ${
            spinning ? "" : "pulse-ring"
          }`}
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <Wheel rotation={rotation} highlight={spinning ? null : resultIndex} size={size} />
        </div>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="btn-neon mt-2 w-full max-w-md rounded-2xl py-5 font-display text-3xl text-white tracking-wider"
        aria-label="Spin the wheel"
      >
        {spinning ? "SPINNING…" : "SPIN THE WHEEL"}
      </button>

      <Legend />

      <BadgesGrid unlocked={unlockedBadges} />

      {state.spins > 0 && (
        <button
          onClick={resetProgress}
          className="mt-2 text-[11px] uppercase tracking-widest text-white/40 hover:text-white/70"
        >
          Reset bar card
        </button>
      )}

      {newBadge && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full glass font-display tracking-wider text-amber-200 shadow-xl">
          🏅 Badge unlocked: {newBadge}
        </div>
      )}

      <Confetti trigger={confettiKey} />
      <JohnnyPop trigger={johnnyKey} />

      {result && resultMeta && (
        <ResultModal
          drink={result}
          meta={resultMeta}
          onClose={() => setResult(null)}
          onCheers={() => {
            setResult(null);
            setJohnnyKey((k) => k + 1);
          }}
          onAgain={() => {
            setResult(null);
            setTimeout(spin, 150);
          }}
          streak={state.streak}
        />
      )}
    </main>
  );
}

function StatsBar({ state }: { state: GameState }) {
  return (
    <div className="glass rounded-2xl w-full max-w-md grid grid-cols-3 divide-x divide-white/10">
      <Stat label="Points" value={state.points} tint="text-amber-200" />
      <Stat label="Spins" value={state.spins} tint="text-cyan-200" />
      <Stat
        label="Streak"
        value={state.streak}
        tint="text-pink-200"
        suffix={state.streak > 1 ? "🔥" : ""}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  tint,
  suffix,
}: {
  label: string;
  value: number;
  tint: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-3">
      <div className={`font-display text-3xl ${tint}`}>
        {value}
        {suffix ? ` ${suffix}` : ""}
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">
        {label}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-md">
      {(["common", "rare", "epic", "legendary"] as const).map((r) => {
        const m = RARITY_META[r];
        return (
          <span
            key={r}
            className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full glass"
            style={{ color: m.glow, boxShadow: `0 0 12px ${m.glow}55` }}
          >
            {m.label} ×{m.mult}
          </span>
        );
      })}
    </div>
  );
}

function BadgesGrid({ unlocked }: { unlocked: Set<string> }) {
  return (
    <div className="w-full max-w-md">
      <div className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2 text-center">
        Bar Card · Badges
      </div>
      <div className="grid grid-cols-4 gap-2">
        {BADGES.map((b) => {
          const got = unlocked.has(b.id);
          return (
            <div
              key={b.id}
              className={`glass rounded-xl flex flex-col items-center justify-center py-2 transition ${
                got ? "opacity-100" : "opacity-30 grayscale"
              }`}
              style={
                got
                  ? { boxShadow: "0 0 20px rgba(255,209,102,0.4)" }
                  : undefined
              }
            >
              <div className="text-2xl">{b.emoji}</div>
              <div className="text-[9px] text-center mt-1 text-white/80 leading-tight px-1">
                {b.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResultModal({
  drink,
  meta,
  onClose,
  onCheers,
  onAgain,
  streak,
}: {
  drink: Drink;
  meta: (typeof RARITY_META)[keyof typeof RARITY_META];
  onClose: () => void;
  onCheers: () => void;
  onAgain: () => void;
  streak: number;
}) {
  const bonus = Math.min(streak, 5);
  return (
    <div
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3"
      onClick={onClose}
    >
      <div
        className="glass w-full max-w-md rounded-3xl p-6 text-center relative"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: `0 0 60px ${meta.glow}66` }}
      >
        <div
          className="text-[10px] uppercase tracking-[0.4em] font-bold"
          style={{ color: meta.glow }}
        >
          {meta.label} · ×{meta.mult} points
        </div>
        <div className="text-7xl my-3 floaty" aria-hidden>
          {drink.emoji}
        </div>
        <div className="font-display text-4xl neon-cyan-text leading-none">
          {drink.name}
        </div>
        <p className="mt-2 text-white/80 italic">"{drink.tagline}"</p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-left">
          <InfoBox label="Base points" value={drink.points} />
          <InfoBox label="Streak bonus" value={`×${bonus}`} />
        </div>

        <div className="mt-3 text-sm text-white/70">
          Johnny says: pour it, shoot a photo, post the story.
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onCheers}
            className="flex-1 rounded-xl py-3 glass font-semibold"
          >
            Cheers 🥂
          </button>
          <button
            onClick={onAgain}
            className="flex-1 btn-neon rounded-xl py-3 font-semibold text-white"
          >
            Spin again
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="glass rounded-xl px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-white/50">
        {label}
      </div>
      <div className="font-display text-2xl text-amber-200">{value}</div>
    </div>
  );
}
