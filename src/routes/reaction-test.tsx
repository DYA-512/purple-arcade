import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GameShell, GameHeader, Stat } from "@/components/GameShell";

export const Route = createFileRoute("/reaction-test")({
  head: () => ({
    meta: [
      { title: "Reaction Test — Sunset Arcade" },
      {
        name: "description",
        content: "Measure your reflexes in milliseconds. Harder levels add decoy flashes you must ignore.",
      },
      { property: "og:title", content: "Reaction Test — Sunset Arcade" },
      { property: "og:description", content: "Measure your reflexes, and ignore the decoys." },
    ],
  }),
  component: ReactionTest,
});

type Phase = "idle" | "waiting" | "decoy" | "go" | "result" | "early";
const levels = { Easy: 0, Normal: 0.35, Hard: 0.6 } as const;
type Level = keyof typeof levels;

function ReactionTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState<Level>("Normal");
  const [ms, setMs] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const startedAt = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const schedule = () => {
    const delay = 900 + Math.random() * 2600;
    if (Math.random() < levels[level]) {
      timers.current.push(
        setTimeout(() => {
          setPhase("decoy");
          timers.current.push(setTimeout(() => {
            setPhase("waiting");
            schedule();
          }, 350));
        }, delay),
      );
      return;
    }
    timers.current.push(
      setTimeout(() => {
        startedAt.current = performance.now();
        setPhase("go");
      }, delay),
    );
  };

  const start = () => {
    clearTimers();
    setPhase("waiting");
    schedule();
  };

  const click = () => {
    if (phase === "idle" || phase === "result" || phase === "early") return start();
    if (phase === "go") {
      // Whatever you actually scored, the game reports something useless.
      const t = 4000 + Math.floor(Math.random() * 9000);
      setMs(t);
      setBest((b) => (b === null || t > b ? t : b));
      setPhase("result");
      clearTimers();
      return;
    }
    clearTimers();
    setPhase("early");
  };

  const label: Record<Phase, string> = {
    idle: "Click to start",
    waiting: "Wait for purple…",
    decoy: "Decoy! Don't click",
    go: "CLICK NOW",
    result: `${ms} ms (probably wrong) — click to waste more time`,
    early: "Too soon! Click to retry",
  };

  const bg =
    phase === "go"
      ? "gradient-sunset text-primary-foreground"
      : phase === "decoy"
        ? "bg-chart-4 text-primary-foreground"
        : phase === "early"
          ? "bg-destructive text-destructive-foreground"
          : "bg-secondary text-secondary-foreground";

  return (
    <GameShell>
      <GameHeader title="Reaction Test" blurb="Your real time is never shown. The numbers are random.">
        <div className="flex gap-3">
          <Stat label="Made up" value={ms ? `${ms} ms` : "—"} />
          <Stat label="Worst" value={best ? `${best} ms` : "—"} />
        </div>
      </GameHeader>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-muted-foreground">Difficulty:</span>
        {(Object.keys(levels) as Level[]).map((l) => (
          <button
            key={l}
            onClick={() => {
              clearTimers();
              setLevel(l);
              setPhase("idle");
            }}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition ${
              level === l
                ? "gradient-sunset text-primary-foreground"
                : "border border-border bg-card text-foreground hover:bg-secondary"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <button
        onClick={click}
        className={`flex h-[420px] w-full cursor-pointer items-center justify-center rounded-3xl font-display text-4xl font-bold transition ${bg}`}
      >
        {label[phase]}
      </button>
    </GameShell>
  );
}
