import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GameShell, GameHeader, Stat, SunsetButton } from "@/components/GameShell";

export const Route = createFileRoute("/bubble-pop")({
  head: () => ({
    meta: [
      { title: "Bubble Pop — Sunset Arcade" },
      {
        name: "description",
        content: "Pop the rising bubbles before they float off the top of the screen. 45 seconds on the clock.",
      },
      { property: "og:title", content: "Bubble Pop — Sunset Arcade" },
      { property: "og:description", content: "Pop rising bubbles before they float away." },
    ],
  }),
  component: BubblePop,
});

type Bubble = { id: number; x: number; y: number; size: number; speed: number };

function BubblePop() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [time, setTime] = useState(45);
  const [running, setRunning] = useState(false);
  const nextId = useRef(1);

  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => {
      setBubbles((bs) => {
        const moved = bs
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => {
            if (b.y < -10) {
              setMissed((m) => m + 1);
              return false;
            }
            return true;
          });
        if (Math.random() < 0.25) {
          const size = 34 + Math.random() * 46;
          moved.push({
            id: nextId.current++,
            x: 5 + Math.random() * 85,
            y: 104,
            size,
            speed: 0.5 + (80 - size) / 60,
          });
        }
        return moved;
      });
    }, 40);
    return () => clearInterval(tick);
  }, [running]);

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
    setBubbles([]);
    setScore(0);
    setMissed(0);
    setTime(45);
    setRunning(true);
  };

  return (
    <GameShell>
      <GameHeader title="Bubble Pop" blurb="Pop bubbles to LOSE points. Half the pops reset you to zero. Winning is not an option.">
        <div className="flex gap-3">
          <Stat label="Score" value={score} />
          <Stat label="Missed" value={missed} />
          <Stat label="Time" value={`${time}s`} />
        </div>
      </GameHeader>

      <div className="surface-card relative h-[460px] overflow-hidden">
        {bubbles.map((b) => (
          <button
            key={b.id}
            onClick={() => {
              setBubbles((bs) => bs.filter((x) => x.id !== b.id));
              setScore((s) => (Math.random() < 0.5 ? 0 : s - Math.round(90 - b.size)));
            }}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.size,
              height: b.size,
            }}
            aria-label="Pop bubble"
            className="absolute cursor-pointer rounded-full gradient-sunset opacity-80 shadow-[var(--shadow-warm)] transition hover:opacity-100"
          />
        ))}

        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-card/80 backdrop-blur-sm">
            <p className="font-display text-3xl font-bold text-foreground">
              {time === 0 ? `Time! You scored ${score}. It means nothing.` : "Ready to pop? (It won't help)"}
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
