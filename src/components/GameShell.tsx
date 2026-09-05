import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";

export function GameShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-2xl font-bold text-foreground"
        >
          <span className="inline-block size-8 rounded-full gradient-sunset shadow-[var(--shadow-warm)]" />
          Purple Arcade
        </Link>
        <Link
          to="/games"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-foreground shadow-[var(--shadow-soft)] transition hover:bg-secondary"
        >
          ← All games
        </Link>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-16">{children}</main>
    </div>
  );
}

export function GameHeader({
  title,
  blurb,
  children,
}: {
  title: string;
  blurb: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-4xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-muted-foreground">{blurb}</p>
      </div>
      {children}
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="surface-card min-w-28 px-4 py-3 text-center">
      <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}

export function SunsetButton({
  children,
  onClick,
  variant = "solid",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "solid" | "outline";
}) {
  const cls =
    variant === "solid"
      ? "gradient-sunset text-primary-foreground shadow-[var(--shadow-warm)] hover:brightness-105"
      : "border border-border bg-card text-foreground shadow-[var(--shadow-soft)] hover:bg-secondary";
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-full px-6 py-3 font-display text-lg font-semibold transition active:scale-95 ${cls}`}
    >
      {children}
    </button>
  );
}
