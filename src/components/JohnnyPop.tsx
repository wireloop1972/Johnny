"use client";

import { useEffect, useState } from "react";

const LINES = [
  "COMING UP!",
  "ONE SEC, CHIEF!",
  "SHAKEN, NOT STIRRED!",
  "ON THE ROCKS?",
  "HOLD MY SHAKER!",
  "YOU GOT IT!",
];

export default function JohnnyPop({
  trigger,
  onDone,
}: {
  trigger: number;
  onDone?: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [line, setLine] = useState(LINES[0]);

  useEffect(() => {
    if (!trigger) return;
    setLine(LINES[Math.floor(Math.random() * LINES.length)]);
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onDone?.();
    }, 2400);
    return () => clearTimeout(t);
  }, [trigger, onDone]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center pointer-events-none pb-6"
      aria-hidden
    >
      <div className="relative animate-[johnny-in_360ms_cubic-bezier(.2,.9,.3,1.3)_both]">
        <SpeechBubble text={line} />
        <JohnnySVG />
      </div>
      <style>{`
        @keyframes johnny-in {
          0%   { transform: translateY(120%) rotate(-6deg); opacity: 0; }
          60%  { transform: translateY(-8%)  rotate(3deg);  opacity: 1; }
          100% { transform: translateY(0)    rotate(0deg);  opacity: 1; }
        }
        @keyframes shake-it {
          0%,100% { transform: rotate(-14deg) translateY(0); }
          25%     { transform: rotate(18deg)  translateY(-3px); }
          50%     { transform: rotate(-14deg) translateY(2px); }
          75%     { transform: rotate(18deg)  translateY(-3px); }
        }
        .shaker-arm { transform-origin: 86px 138px; animation: shake-it 380ms ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function SpeechBubble({ text }: { text: string }) {
  return (
    <div
      className="absolute -top-8 left-1/2 -translate-x-1/2 -translate-y-full
                 font-display text-2xl tracking-wider text-[#0b0416]
                 bg-amber-200 px-4 py-2 rounded-2xl whitespace-nowrap"
      style={{
        boxShadow:
          "0 0 0 3px #0b0416, 0 10px 30px rgba(0,0,0,0.4), 0 0 40px rgba(255,209,102,0.6)",
      }}
    >
      {text}
      <span
        className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
        style={{
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "14px solid #0b0416",
        }}
      />
      <span
        className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
        style={{
          top: "100%",
          marginTop: "-4px",
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderTop: "10px solid #fde68a",
        }}
      />
    </div>
  );
}

function JohnnySVG() {
  return (
    <svg
      width="240"
      height="260"
      viewBox="0 0 240 260"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 20px 24px rgba(0,0,0,0.55))" }}
    >
      {/* body / white shirt */}
      <path
        d="M40 260 C 40 200, 70 170, 120 170 C 170 170, 200 200, 200 260 Z"
        fill="#f8f5ff"
        stroke="#0b0416"
        strokeWidth="4"
      />
      {/* shirt placket */}
      <line x1="120" y1="180" x2="120" y2="260" stroke="#0b0416" strokeWidth="3" />
      <circle cx="120" cy="210" r="2.5" fill="#0b0416" />
      <circle cx="120" cy="235" r="2.5" fill="#0b0416" />

      {/* black vest */}
      <path
        d="M60 260 L 85 185 L 120 205 L 155 185 L 180 260 Z"
        fill="#0b0416"
      />

      {/* bowtie */}
      <g>
        <polygon points="100,178 120,190 100,202" fill="#12e7ff" stroke="#0b0416" strokeWidth="2.5" />
        <polygon points="140,178 120,190 140,202" fill="#12e7ff" stroke="#0b0416" strokeWidth="2.5" />
        <rect x="116" y="184" width="8" height="12" fill="#12e7ff" stroke="#0b0416" strokeWidth="2.5" />
      </g>

      {/* neck */}
      <rect x="108" y="155" width="24" height="20" fill="#f0c9a4" stroke="#0b0416" strokeWidth="3" />

      {/* head (bald) */}
      <ellipse cx="120" cy="110" rx="52" ry="58" fill="#f0c9a4" stroke="#0b0416" strokeWidth="4" />
      {/* shiny head highlight */}
      <ellipse cx="100" cy="78" rx="18" ry="10" fill="#fff4e4" opacity="0.8" />

      {/* side hair tufts (going gray) */}
      <path
        d="M72 120 Q 60 100, 76 88 Q 70 110, 80 128 Z"
        fill="#c9b9a6"
        stroke="#0b0416"
        strokeWidth="3"
      />
      <path
        d="M168 120 Q 180 100, 164 88 Q 170 110, 160 128 Z"
        fill="#c9b9a6"
        stroke="#0b0416"
        strokeWidth="3"
      />

      {/* ears */}
      <ellipse cx="70" cy="112" rx="7" ry="10" fill="#e5b892" stroke="#0b0416" strokeWidth="3" />
      <ellipse cx="170" cy="112" rx="7" ry="10" fill="#e5b892" stroke="#0b0416" strokeWidth="3" />

      {/* eyebrows (raised, mischievous) */}
      <path d="M88 92 Q 98 84, 110 92" stroke="#5a4630" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M130 92 Q 142 84, 152 92" stroke="#5a4630" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* eyes */}
      <circle cx="100" cy="108" r="6" fill="#fff" stroke="#0b0416" strokeWidth="2.5" />
      <circle cx="140" cy="108" r="6" fill="#fff" stroke="#0b0416" strokeWidth="2.5" />
      <circle cx="102" cy="109" r="2.8" fill="#0b0416" />
      <circle cx="142" cy="109" r="2.8" fill="#0b0416" />
      {/* glint */}
      <circle cx="103.5" cy="107.5" r="0.9" fill="#fff" />
      <circle cx="143.5" cy="107.5" r="0.9" fill="#fff" />

      {/* cheeky grin w/ teeth */}
      <path
        d="M92 135 Q 120 160, 150 135"
        fill="#3a1620"
        stroke="#0b0416"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M100 139 Q 120 149, 142 139 L 142 141 Q 120 151, 100 141 Z"
        fill="#fff8e1"
      />
      {/* nose */}
      <path d="M120 108 Q 124 122, 118 128" stroke="#8a6a52" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* left arm on hip */}
      <path
        d="M58 200 Q 42 210, 52 238 L 72 236 Q 70 218, 80 206 Z"
        fill="#f8f5ff"
        stroke="#0b0416"
        strokeWidth="4"
      />

      {/* right arm + shaker (animated) */}
      <g className="shaker-arm">
        <path
          d="M160 205 Q 190 190, 190 160 L 178 155 Q 172 180, 150 195 Z"
          fill="#f8f5ff"
          stroke="#0b0416"
          strokeWidth="4"
        />
        {/* hand */}
        <circle cx="188" cy="158" r="10" fill="#f0c9a4" stroke="#0b0416" strokeWidth="3" />

        {/* shaker */}
        <g transform="translate(178 95)">
          <rect x="0" y="40" width="36" height="42" rx="4" fill="#c9d3dc" stroke="#0b0416" strokeWidth="3" />
          <rect x="4" y="28" width="28" height="16" fill="#aab5bf" stroke="#0b0416" strokeWidth="3" />
          <rect x="8" y="16" width="20" height="16" rx="3" fill="#c9d3dc" stroke="#0b0416" strokeWidth="3" />
          <rect x="10" y="10" width="16" height="8" rx="2" fill="#aab5bf" stroke="#0b0416" strokeWidth="3" />
          {/* shine */}
          <rect x="5" y="46" width="4" height="30" fill="#ffffff" opacity="0.7" />
          {/* motion streaks */}
          <path d="M-8 20 L -2 24" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
          <path d="M-10 34 L -2 36" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
          <path d="M40 20 L 46 24" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
          <path d="M42 36 L 50 36" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
        </g>
      </g>
    </svg>
  );
}
