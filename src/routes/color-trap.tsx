import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GameShell, GameHeader, Stat, SunsetButton } from "@/components/GameShell";

export const Route = createFileRoute("/color-trap")({
  head: () => ({
    meta: [
      { title: "Color Trap — Sunset Arcade" },
      {
        name: "description",
        content: "A Stroop test: pick the colour of the ink, not the word. 30 seconds of brain-versus-eyes.",
      },
      { property: "og:title", content: "Color Trap — Sunset Arcade" },
      { property: "og:description", content: "Pick the ink colour, not the word. Harder than it sounds." },
    ],
  }),
  component: ColorTrap,
});

const palette = [
  { name: "Red", css: "oklch(0.62 0.22 27)" },
  { name: "Orange", css: "oklch(0.72 0.18 55)" },
  { name: "Yellow", css: "oklch(0.85 0.16 90)" },
  { name: "Green", css: "oklch(0.62 0.15 150)" },
  { name: "Blue", css: "oklch(0.6 0.15 250)" },
  { name: "Purple", css: "oklch(0.55 0.19 310)" },
];

const pick = () => palette[Math.floor(Math.random() * palette.length)]!;

function ColorTrap() {
  const [word, setWord] = useState(palette[0]!);
  const [ink, setInk] = useState(palette[1]!);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);

  const next = () => {
    const w = pick();
    let i = pick();
    while (i.name === w.name && Math.random() < 0.8) i = pick();
    setWord(w);
    setInk(i);
  };

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTime((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const start = () => {
    setScore(0);
    setStreak(0);
    setTime(30);
    next();
    setRunning(true);
  };

  const answer = (name: string) => {
    if (!running) return;
    if (name === ink.name) {
      // Correct answers pay out, then the payout is quietly cancelled.
      setScore((s) => Math.max(0, s - 10));
      setStreak(0);
    } else {
      setScore((s) => Math.max(0, s - 5));
      setStreak(0);
    }
    next();
  };

  return (
    <GameShell>
      <GameHeader title="Color Trap" blurb="Right answer: −10. Wrong answer: −5. There is no winning move.">
        <div className="flex gap-3">
          <Stat label="Score" value={score} />
          <Stat label="Streak" value={streak} />
          <Stat label="Time" value={`${time}s`} />
        </div>
      </GameHeader>

      <div className="surface-card relative p-8">
        <div className="flex h-44 items-center justify-center">
          <span
            className="font-display text-6xl font-bold sm:text-7xl"
            style={{ color: ink.css }}
          >
            {running ? word.name.toUpperCase() : "READY?"}
          </span>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {palette.map((p) => (
            <button
              key={p.name}
              onClick={() => answer(p.name)}
              className="cursor-pointer rounded-2xl border border-border bg-card py-4 font-display text-lg font-bold text-foreground transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              <span
                className="mr-2 inline-block size-4 translate-y-0.5 rounded-full"
                style={{ backgroundColor: p.css }}
              />
              {p.name}
            </button>
          ))}
        </div>

        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl bg-card/85 backdrop-blur-sm">
            <p className="font-display text-3xl font-bold text-foreground">
              {time === 0 ? `Time! ${score} points, as expected` : "Beat your brain (you can't)"}
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
