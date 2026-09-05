import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sunset Arcade — Free Mini Games" },
      {
        name: "description",
        content:
          "Six quick, friendly mini games in a warm sunset arcade. Runaway Button, Bubble Pop, Reaction Test, Color Trap, Whack-a-Critter and Memory Flip.",
      },
      { property: "og:title", content: "Sunset Arcade — Free Mini Games" },
      {
        property: "og:description",
        content: "Six quick, friendly mini games. No sign-up, just play.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

const games = [
  {
    to: "/runaway-button" as const,
    name: "Runaway Button",
    tagline: "Catch the button that dodges your cursor.",
    emoji: "🏃",
  },
  {
    to: "/bubble-pop" as const,
    name: "Bubble Pop",
    tagline: "Pop the rising bubbles before they float away.",
    emoji: "🫧",
  },
  {
    to: "/reaction-test" as const,
    name: "Reaction Test",
    tagline: "How fast are your reflexes? Watch out for decoys.",
    emoji: "⚡",
  },
  {
    to: "/color-trap" as const,
    name: "Color Trap",
    tagline: "A Stroop test that fights your own brain.",
    emoji: "🎨",
  },
  {
    to: "/whack-a-critter" as const,
    name: "Whack-a-Critter",
    tagline: "Bonk the critters — but never the bombs.",
    emoji: "🐹",
  },
  {
    to: "/memory-flip" as const,
    name: "Memory Flip",
    tagline: "Match the pairs as the grid grows.",
    emoji: "🃏",
  },
];

function Home() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2 font-display text-2xl font-bold text-foreground">
          <span className="inline-block size-8 rounded-full gradient-sunset shadow-[var(--shadow-warm)]" />
          Sunset Arcade
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-20">
        <section className="py-12 text-center">
          <h1 className="mx-auto max-w-2xl font-display text-5xl font-bold leading-tight text-foreground sm:text-6xl">
            Play something <span className="text-sunset">warm &amp; sunny</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Six bite-sized games. No accounts, no downloads — just pick one and
            play.
          </p>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((g) => (
            <Link
              key={g.to}
              to={g.to}
              className="surface-card group p-6 transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-warm)]"
            >
              <div className="text-4xl">{g.emoji}</div>
              <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">
                {g.name}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{g.tagline}</p>
              <span className="mt-4 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground transition group-hover:gradient-sunset group-hover:text-primary-foreground">
                Play →
              </span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
