"use client";

import { useEffect, useRef } from "react";
import { DRINKS } from "@/lib/drinks";

type Props = {
  rotation: number; // radians
  highlight: number | null; // index of chosen slice when idle
  size: number;
};

/**
 * Canvas wheel — rotation is controlled externally so the spin animation
 * lives in the parent (allows landing on a predetermined slice).
 */
export default function Wheel({ rotation, highlight, size }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = size * dpr;
    cv.height = size * dpr;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(ctx, size, rotation, highlight);
  }, [rotation, highlight, size]);

  return (
    <canvas
      ref={ref}
      style={{ width: size, height: size }}
      className="block"
      aria-label="Cocktail wheel"
    />
  );
}

function draw(
  ctx: CanvasRenderingContext2D,
  size: number,
  rotation: number,
  highlight: number | null,
) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 6;
  const n = DRINKS.length;
  const slice = (Math.PI * 2) / n;

  ctx.clearRect(0, 0, size, size);

  // outer glow ring
  const grd = ctx.createRadialGradient(cx, cy, r - 18, cx, cy, r + 14);
  grd.addColorStop(0, "rgba(255,255,255,0)");
  grd.addColorStop(1, "rgba(255, 46, 147, 0.55)");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 14, 0, Math.PI * 2);
  ctx.fill();

  // slices
  for (let i = 0; i < n; i++) {
    const a0 = rotation + i * slice;
    const a1 = a0 + slice;
    const drink = DRINKS[i];
    const isHighlight = highlight === i;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, a0, a1);
    ctx.closePath();

    const g = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
    g.addColorStop(0, lighten(drink.color, 0.35));
    g.addColorStop(1, drink.color);
    ctx.fillStyle = g;
    ctx.fill();

    // slice divider
    ctx.strokeStyle = "rgba(11, 4, 22, 0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // label
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a0 + slice / 2);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    // emoji
    ctx.font = `${size * 0.055}px system-ui`;
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fillText(drink.emoji, r - 12, -size * 0.04);

    // name
    ctx.font = `600 ${size * 0.032}px var(--font-fredoka), system-ui, sans-serif`;
    ctx.fillStyle = isHighlight ? "#fff" : "rgba(20,8,30,0.85)";
    if (isHighlight) {
      ctx.shadowColor = "rgba(255,255,255,0.95)";
      ctx.shadowBlur = 10;
    }
    ctx.fillText(truncate(drink.name, 13), r - 14, size * 0.012);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // inner hub
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.18, 0, Math.PI * 2);
  const hub = ctx.createRadialGradient(cx - 8, cy - 8, 4, cx, cy, r * 0.2);
  hub.addColorStop(0, "#fff7d6");
  hub.addColorStop(1, "#ffd166");
  ctx.fillStyle = hub;
  ctx.fill();
  ctx.strokeStyle = "rgba(11,4,22,0.8)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // monogram J
  ctx.fillStyle = "#0b0416";
  ctx.font = `700 ${size * 0.09}px var(--font-bangers), Impact, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("J", cx, cy + 2);

  // outer ring stroke
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 4;
  ctx.stroke();
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function lighten(hex: string, amt: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const m = (c: number) => Math.round(c + (255 - c) * amt);
  return `rgb(${m(r)}, ${m(g)}, ${m(b)})`;
}
