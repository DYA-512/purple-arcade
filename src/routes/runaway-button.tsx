import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { GameShell, GameHeader, Stat, SunsetButton } from "@/components/GameShell";

export const Route = createFileRoute("/runaway-button")({
  head: () => ({
    meta: [
      { title: "Runaway Button — Sunset Arcade" },
      {
        name: "description",
        content: "Try to click the button that keeps dodging your cursor. How many catches can you get?",
      },
      { property: "og:title", content: "Runaway Button — Sunset Arcade" },
      { property: "og:description", content: "Catch the button that runs away from your cursor." },
    ],
  }),
  component: RunawayButton,
});

const levels = { Easy: 90, Normal: 130, Hard: 180 } as const;
type Level = keyof typeof levels;

function RunawayButton() {
  const areaRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [catches, setCatches] = useState(0);
  const [dodges, setDodges] = useState(0);
  const [level, setLevel] = useState<Level>("Normal");

  const flee = (e: React.MouseEvent) => {
    const area = areaRef.current;
    if (!area) return;
    const r = area.getBoundingClientRect();
    const bx = r.left + (pos.x / 100) * r.width;
    const by = r.top + (pos.y / 100) * r.height;
    const dist = Math.hypot(e.clientX - bx, e.clientY - by);
    if (dist > levels[level]) return;
    setPos({ x: 8 + Math.random() * 84, y: 12 + Math.random() * 76 });
    setDodges((d) => d + 1);
  };

  return (
    <GameShell>
      <GameHeader title="Runaway Button" blurb="Click it — if you can.">
        <div className="flex gap-3">
          <Stat label="Catches" value={catches} />
          <Stat label="Dodges" value={dodges} />
        </div>
      </GameHeader>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-muted-foreground">Difficulty:</span>
        {(Object.keys(levels) as Level[]).map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition ${
              level === l
                ? "gradient-sunset text-primary-foreground"
                : "border border-border bg-card text-foreground hover:bg-secondary"
            }`}
          >
            {l}
          </button>
        ))}
        <div className="ml-auto">
          <SunsetButton
            variant="outline"
            onClick={() => {
              setCatches(0);
              setDodges(0);
              setPos({ x: 50, y: 50 });
            }}
          >
            Reset
          </SunsetButton>
        </div>
      </div>

      <div
        ref={areaRef}
        onMouseMove={flee}
        className="surface-card relative h-[420px] overflow-hidden"
      >
        <button
          onClick={() => setCatches((c) => c + 1)}
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full gradient-sunset px-7 py-4 font-display text-lg font-bold text-primary-foreground shadow-[var(--shadow-warm)] transition-all duration-200 ease-out"
        >
          Catch me!
        </button>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Tip: on a touch screen the button can&apos;t run — tap away.
      </p>
    </GameShell>
  );
}
