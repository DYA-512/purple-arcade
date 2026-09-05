import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GameShell, GameHeader, Stat, SunsetButton } from "@/components/GameShell";

export const Route = createFileRoute("/whack-a-critter")({
  head: () => ({
    meta: [
      { title: "Whack-a-Critter — Sunset Arcade" },
      {
        name: "description",
        content: "Bonk the critters as they pop out of their burrows — and never hit a bomb on hard mode.",
      },
      { property: "og:title", content: "Whack-a-Critter — Sunset Arcade" },
      { property: "og:description", content: "Whack critters, dodge bombs, beat the clock." },
    ],
  }),
  component: WhackACritter,
});

const levels = { Easy: { speed: 950, bomb: 0 }, Normal: { speed: 750, bomb: 0.15 }, Hard: { speed: 520, bomb: 0.3 } } as const;
type Level = keyof typeof levels;

function WhackACritter() {
  const [level, setLevel] = useState<Level>("Normal");
  const [active, setActive] = useState<{ cell: number; bomb: boolean } | null>(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(40);
  const [running, setRunning] = useState(false);
  const [flash, setFlash] = useState("");
  const hit = useRef(false);

  useEffect(() => {
    if (!running) return;
    const cfg = levels[level];
    const t = setInterval(() => {
      hit.current = false;
      setActive({ cell: Math.floor(Math.random() * 9), bomb: Math.random() < cfg.bomb });
    }, cfg.speed);
    return () => clearInterval(t);
  }, [running, level]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTime((s) => {
        if (s <= 1) {
          setRunning(false);
          setActive(null);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const start = () => {
    setScore(0);
    setTime(40);
    setFlash("");
    setRunning(true);
  };

  const whack = (cell: number) => {
    if (!running || !active || active.cell !== cell || hit.current) return;
    hit.current = true;
    if (active.bomb) {
      setScore((s) => Math.max(0, s - 25));
      setFlash("💥 Bomb! -25");
    } else {
      setScore((s) => s + 10);
      setFlash("Nice! +10");
    }
    setActive(null);
    setTimeout(() => setFlash(""), 700);
  };

  return (
    <GameShell>
      <GameHeader title="Whack-a-Critter" blurb="Bonk critters. Avoid bombs.">
        <div className="flex gap-3">
          <Stat label="Score" value={score} />
          <Stat label="Time" value={`${time}s`} />
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
        <span className="ml-auto font-display text-lg font-bold text-foreground">{flash}</span>
      </div>

      <div className="surface-card relative p-6">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <button
              key={i}
              onClick={() => whack(i)}
              className="flex aspect-square cursor-pointer items-center justify-center rounded-3xl bg-secondary text-5xl transition active:scale-95"
            >
              {active?.cell === i ? (active.bomb ? "💣" : "🐹") : ""}
            </button>
          ))}
        </div>

        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl bg-card/85 backdrop-blur-sm">
            <p className="font-display text-3xl font-bold text-foreground">
              {time === 0 ? `Time! You scored ${score}` : "Grab your mallet"}
            </p>
            <SunsetButton onClick={start}>
              {time === 0 ? "Play again" : "Start game"}
            </SunsetButton>
          </div>
        )}
      </div>
    </GameShell>
  );
}
