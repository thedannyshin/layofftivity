import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * SURFACE VOCABULARY — one source of truth for "is this clickable?".
 *
 * A filled, rounded box means "you can tap this". Nothing else gets a box.
 * static*  → open content: no fill, no outline, separated by whitespace only.
 * tap*     → must be a real <Link>/<button> with exactly one primary action.
 */
const cardBase = "rounded-2xl p-4";
const tapBase =
  "cursor-pointer text-left transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft disabled:pointer-events-none disabled:opacity-60";

/** Static (non-tappable) content block — open, no container fill. */
export const staticCard = "rounded-2xl px-0.5 py-1";

/** Static content that genuinely needs highlighting — used sparingly. */
export const staticCardAccent = `${cardBase} bg-accent-soft/70`;

/** Tappable card. */
export const tapCard = `${cardBase} bg-card ${tapBase} hover:bg-secondary/70 active:bg-secondary`;

/** Tappable accent (gold) card. */
export const tapCardAccent = `${cardBase} bg-accent-soft ${tapBase} hover:bg-accent-soft/80 active:bg-accent-soft/70`;

/**
 * Grouped list: many tappable rows share ONE container instead of one box each.
 * Use <ListGroup> around rows that use `tapRow`.
 */
export const tapRow = `flex w-full items-center gap-3 px-4 py-3.5 ${tapBase} hover:bg-secondary/60 active:bg-secondary`;

export function ListGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl bg-card", className)}>
      <div className="divide-y divide-background">{children}</div>
    </div>
  );
}

/** Tappable pill (chips, quick replies, filters) — same language as Button. */
export const tapPill =
  "inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-secondary px-3.5 py-2 text-[13px] font-semibold text-foreground cursor-pointer transition-colors duration-[120ms] hover:bg-primary-soft active:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft";

/** Selected state of a tappable pill. */
export const tapPillActive =
  "inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-[13px] font-semibold text-primary-foreground cursor-pointer transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft";

/** One shared look for selectable option rows (onboarding, invite, continue together). */
export function selectRow(selected: boolean) {
  return cn(
    "flex w-full items-center gap-3 rounded-2xl p-4 text-left cursor-pointer transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft",
    selected ? "bg-accent-soft" : "bg-secondary hover:bg-primary-soft/70 active:bg-primary-soft",
  );
}

export function Screen({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <main className={cn("mx-auto w-full max-w-[430px]", padded && "px-5 pb-8", className)}>
      {children}
    </main>
  );
}

export function BackButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-label="Go back"
      onClick={onClick}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-primary-soft active:bg-primary-soft",
        className,
      )}
    >
      <ChevronLeft className="h-5 w-5" />
    </button>
  );
}

export function TopBar({
  title,
  subtitle,
  back,
  right,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-20 -mx-5 mb-4 bg-background/95 px-5 pt-3 pb-3 backdrop-blur">
      <div className="flex items-center gap-2">
        {back && <BackButton onClick={() => router.history.back()} />}
        <div className="min-w-0 flex-1">
          <h1 className="lo-display truncate text-[20px] leading-tight">{title}</h1>
          {subtitle && <p className="truncate text-[13px] text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}

export function SectionTitle({
  children,
  action,
  to,
}: {
  children: ReactNode;
  action?: string;
  to?: string;
}) {
  return (
    <div className="mt-8 mb-3 flex items-baseline justify-between">
      <h2 className="lo-display text-[18px]">{children}</h2>
      {action && to && (
        <Link
          to={to}
          className="inline-flex shrink-0 cursor-pointer items-center gap-0.5 py-1 text-[13px] font-bold text-foreground underline-offset-4 transition-opacity hover:underline active:opacity-70"
        >
          {action}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function Card({
  children,
  className,
  as: As = "div",
  variant = "plain",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  variant?: "plain" | "accent";
}) {
  return (
    <As
      className={cn(
        variant === "accent" ? `${cardBase} bg-primary-soft` : "rounded-2xl px-0.5 py-1",
        className,
      )}
    >
      {children}
    </As>
  );
}

export function Chip({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "yellow";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-[13px] font-semibold",
        tone === "neutral" && "border-border text-foreground",
        tone === "green" && "border-primary/40 text-foreground",
        tone === "yellow" && "border-accent text-accent-foreground",
      )}
    >
      {children}
    </span>
  );
}

/**
 * Dot-separated metadata line. Replaces stacked sentences with one scannable row.
 */
export function Meta({
  items,
  className,
}: {
  items: (string | false | null | undefined)[];
  className?: string;
}) {
  const parts = items.filter(Boolean) as string[];
  if (!parts.length) return null;
  return (
    <p className={cn("truncate text-[13px] text-muted-foreground", className)}>
      {parts.join(" · ")}
    </p>
  );
}

/** Long copy collapsed to a couple of lines with a real Read more control. */
export function Clamp({
  children,
  lines = 2,
  className,
}: {
  children: string;
  lines?: 2 | 3;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const long = children.length > 95;
  return (
    <div>
      <p
        className={cn(
          "text-[15px] leading-relaxed",
          !open && (lines === 2 ? "line-clamp-2" : "line-clamp-3"),
          className,
        )}
      >
        {children}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-1.5 cursor-pointer rounded-lg bg-secondary px-3 py-1.5 text-[12px] font-bold text-foreground transition-colors hover:bg-primary-soft active:bg-primary-soft"
        >
          {open ? "Less" : "Read more"}
        </button>
      )}
    </div>
  );
}

/** Compact icon + value facts in a 2-up grid — replaces stacked label/value lists. */
export function FactGrid({ facts }: { facts: { icon: ReactNode; value: string; hint?: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
      {facts.map((f) => (
        <div key={f.value + (f.hint ?? "")} className="flex items-start gap-2.5">
          <span className="mt-0.5 shrink-0 text-primary">{f.icon}</span>
          <div className="min-w-0">
            <p className="text-[15px] leading-snug font-bold">{f.value}</p>
            {f.hint && <p className="text-[12px] text-muted-foreground">{f.hint}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Horizontal snap deck — one item at a time instead of a stack of paragraphs. */
export function Deck({ children }: { children: ReactNode }) {
  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
      {children}
    </div>
  );
}

export const deckItem = "w-[78%] shrink-0 snap-start rounded-2xl bg-card p-4";

/** Tappable card inside a horizontal deck/carousel (photo on top, text below). */
export const deckCard = `w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl bg-card ${tapBase} hover:bg-secondary/70 active:bg-secondary`;

/** Circular progress ring with the number inside — a count, not a sentence. */
export function Ring({
  value,
  total,
  size = 56,
  label,
}: {
  value: number;
  total: number;
  size?: number;
  label?: string;
}) {
  const pct = total > 0 ? Math.min(1, value / total) : 0;
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <span className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={6} className="stroke-secondary" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct)}
            className="stroke-primary transition-[stroke-dashoffset] duration-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[13px] font-extrabold">
          {value}/{total}
        </span>
      </span>
      {label && <span className="text-[13px] font-semibold text-muted-foreground">{label}</span>}
    </div>
  );
}

export function Avatar({
  src,
  name,
  size = 44,
  className,
  initials,
}: {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
  initials?: string;
}) {
  if (!src) {
    const fallback =
      initials ??
      name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
    return (
      <span
        aria-label={name}
        role="img"
        style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-primary font-extrabold text-primary-foreground",
          className,
        )}
      >
        {fallback || "?"}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      style={{ width: size, height: size }}
      className={cn("shrink-0 rounded-full object-cover", className)}
    />
  );
}