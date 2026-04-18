"use client";

import Image from "next/image";
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
    }, 2600);
    return () => clearTimeout(t);
  }, [trigger, onDone]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[70] flex items-end justify-center pointer-events-none"
      aria-hidden
    >
      <div className="relative animate-[johnny-in_420ms_cubic-bezier(.2,.9,.3,1.3)_both] pb-0">
        <SpeechBubble text={line} />
        <div className="relative">
          {/* golden glow halo */}
          <div
            className="absolute inset-0 rounded-[40%] blur-2xl"
            style={{ background: "radial-gradient(circle at 50% 30%, rgba(255,209,102,0.55), transparent 60%)" }}
          />
          <div
            className="relative overflow-hidden rounded-t-[48%] border-4 border-amber-200"
            style={{
              width: "min(72vw, 300px)",
              height: "min(86vw, 360px)",
              boxShadow:
                "0 -10px 40px rgba(255,209,102,0.45), 0 20px 40px rgba(0,0,0,0.6)",
            }}
          >
            <Image
              src="/Johnny.png"
              alt="Johnny the bartender"
              fill
              priority
              sizes="(max-width: 640px) 72vw, 300px"
              style={{
                objectFit: "cover",
                objectPosition: "center top",
                filter: "saturate(1.2) contrast(1.05)",
              }}
            />
            {/* bottom fade into page */}
            <div
              className="absolute inset-x-0 bottom-0 h-16"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(11,4,22,0.95))",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes johnny-in {
          0%   { transform: translateY(110%) rotate(-4deg); opacity: 0; }
          55%  { transform: translateY(-4%)  rotate(2deg);  opacity: 1; }
          80%  { transform: translateY(2%)   rotate(-1deg); }
          100% { transform: translateY(0)    rotate(0deg);  opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function SpeechBubble({ text }: { text: string }) {
  return (
    <div
      className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full
                 font-display text-2xl tracking-wider text-[#0b0416]
                 bg-amber-200 px-4 py-2 rounded-2xl whitespace-nowrap z-10"
      style={{
        boxShadow:
          "0 0 0 3px #0b0416, 0 10px 30px rgba(0,0,0,0.45), 0 0 40px rgba(255,209,102,0.65)",
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
