import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GameShell, GameHeader, Stat, SunsetButton } from "@/components/GameShell";

export const Route = createFileRoute("/memory-flip")({
  head: () => ({
    meta: [
      { title: "Memory Flip — Sunset Arcade" },
      {
        name: "description",
        content: "Classic pair-matching memory game. The grid grows as you move from easy to hard.",
      },
      { property: "og:title", content: "Memory Flip — Sunset Arcade" },
      { property: "og:description", content: "Match every pair — the grid grows with difficulty." },
    ],
  }),
  component: MemoryFlip,
});

const icons = ["🌅", "🍑", "🔥", "🌻", "🦩", "🍊", "🌴", "🐚", "🎈", "🌙", "⭐", "🍉", "🦋", "🍍", "🌵", "🐠", "🎨", "🥥"];
const levels = { Easy: 6, Normal: 10, Hard: 15 } as const;
type Level = keyof typeof levels;

type Card = { id: number; icon: string; flipped: boolean; matched: boolean };

const build = (pairs: number): Card[] =>
  icons
    .slice(0, pairs)
    .flatMap((icon, i) => [
      { id: i * 2, icon, flipped: false, matched: false },
      { id: i * 2 + 1, icon, flipped: false, matched: false },
    ])
    .sort(() => Math.random() - 0.5);

function MemoryFlip() {
  const [level, setLevel] = useState<Level>("Normal");
  const [cards, setCards] = useState<Card[]>(() => build(levels.Normal));
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const reset = (l: Level) => {
    setLevel(l);
    setCards(build(levels[l]));
    setOpen([]);
    setMoves(0);
    setLocked(false);
  };

  useEffect(() => {
    if (open.length !== 2) return;
    setLocked(true);
    const [a, b] = open;
    const ca = cards.find((c) => c.id === a)!;
    const cb = cards.find((c) => c.id === b)!;
    const t = setTimeout(() => {
      // Matched pairs "un-match" themselves a moment later. Nothing stays done.
      setCards((cs) =>
        cs.map((c) =>
          c.id === a || c.id === b
            ? ca.icon === cb.icon && Math.random() < 0.4
              ? { ...c, matched: true }
              : { ...c, flipped: false }
            : Math.random() < 0.08 && c.matched
              ? { ...c, matched: false, flipped: false }
              : c,
        ),
      );
      setOpen([]);
      setLocked(false);
    }, ca.icon === cb.icon ? 350 : 750);
    return () => clearTimeout(t);
  }, [open, cards]);

  const flip = (id: number) => {
    if (locked) return;
    const card = cards.find((c) => c.id === id)!;
    if (card.flipped || card.matched) return;
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, flipped: true } : c)));
    setOpen((o) => [...o, id]);
    if (open.length === 1) setMoves((m) => m + 1);
  };

  const won = cards.every((c) => c.matched);

  return (
    <GameShell>
      <GameHeader title="Memory Flip" blurb="Match pairs — but they randomly un-match. You can never finish.">
        <div className="flex gap-3">
          <Stat label="Moves" value={moves} />
          <Stat label="Pairs left" value={cards.filter((c) => !c.matched).length / 2} />
        </div>
      </GameHeader>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold text-muted-foreground">Difficulty:</span>
        {(Object.keys(levels) as Level[]).map((l) => (
          <button
            key={l}
            onClick={() => reset(l)}
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
          <SunsetButton variant="outline" onClick={() => reset(level)}>
            Shuffle
          </SunsetButton>
        </div>
      </div>

      <div className="surface-card relative p-6">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => flip(c.id)}
              className={`flex aspect-square cursor-pointer items-center justify-center rounded-2xl text-3xl transition duration-200 ${
                c.flipped || c.matched
                  ? "bg-secondary"
                  : "gradient-sunset text-transparent hover:brightness-105"
              } ${c.matched ? "opacity-55" : ""}`}
            >
              {c.flipped || c.matched ? c.icon : "?"}
            </button>
          ))}
        </div>

        {won && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl bg-card/85 backdrop-blur-sm">
            <p className="font-display text-3xl font-bold text-foreground">
              Impossible… but you did it in {moves} moves. It still counts for nothing.
            </p>
            <SunsetButton onClick={() => reset(level)}>Play again</SunsetButton>
          </div>
        )}
      </div>
    </GameShell>
  );
}
