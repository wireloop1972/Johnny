"use client";

import { useEffect, useState } from "react";

const COLORS = ["#ff2e93", "#12e7ff", "#c6ff3d", "#ffd166", "#8a2be2", "#ffffff"];

export default function Confetti({ trigger }: { trigger: number }) {
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const next = Array.from({ length: 70 }, (_, i) => trigger * 1000 + i);
    setPieces(next);
    const t = setTimeout(() => setPieces([]), 3200);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!pieces.length) return null;

  return (
    <>
      {pieces.map((k, i) => {
        const left = Math.random() * 100;
        const dx = (Math.random() - 0.5) * 200;
        const delay = Math.random() * 0.4;
        const duration = 2 + Math.random() * 1.6;
        const color = COLORS[i % COLORS.length];
        return (
          <span
            key={k}
            className="confetti-piece"
            style={{
              left: `${left}vw`,
              background: color,
              // @ts-expect-error custom CSS vars
              "--dx": `${dx}px`,
              "--d": `${duration}s`,
              animationDelay: `${delay}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        );
      })}
    </>
  );
}
