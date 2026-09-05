import { createFileRoute, Link } from "@tanstack/react-router";
import { Play } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Purple Arcade — Welcome to Fun" },
      {
        name: "description",
        content:
          "Welcome to Purple Arcade — a purple-tinted playground of gloriously useless mini games. Press play and waste some time in style.",
      },
      { property: "og:title", content: "Purple Arcade — Welcome to Fun" },
      {
        property: "og:description",
        content:
          "A purple-tinted playground of gloriously useless mini games. Press play and waste some time in style.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Intro,
});

function Intro() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* floating decorative blobs */}
      <div className="pointer-events-none absolute -left-24 top-16 size-64 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-24 size-72 rounded-full bg-accent/25 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-10 size-32 rounded-full bg-secondary blur-2xl" />

      <div className="relative z-10 max-w-2xl text-center">
        <div className="mb-6 flex justify-center">
          <span className="inline-block size-20 rounded-full gradient-sunset shadow-[var(--shadow-warm)]" />
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
          Welcome to
        </p>
        <h1 className="mt-3 font-display text-6xl font-bold leading-tight text-foreground sm:text-7xl">
          Purple <span className="text-sunset">Arcade</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted-foreground">
          A tiny universe of games where nothing counts, points disappear, and
          fun is the only prize. Ready to accomplish absolutely nothing?
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            to="/games"
            className="group inline-flex items-center gap-3 rounded-full gradient-sunset px-10 py-5 font-display text-2xl font-bold text-primary-foreground shadow-[var(--shadow-warm)] transition hover:brightness-105 active:scale-95"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-white/25 transition group-hover:scale-110">
              <Play className="size-5 fill-current" />
            </span>
            Play
          </Link>
          <p className="text-xs font-semibold text-muted-foreground">
            No sign-up · No prizes · No point
          </p>
        </div>
      </div>
    </div>
  );
}
