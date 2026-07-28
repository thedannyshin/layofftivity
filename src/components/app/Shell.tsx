import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
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
  "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3.5 py-2 text-[13px] font-semibold text-foreground cursor-pointer transition-colors duration-[120ms] hover:bg-primary-soft active:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft";

/** Selected state of a tappable pill. */
export const tapPillActive =
  "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-[13px] font-semibold text-primary-foreground cursor-pointer transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft";

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
        "flex h-11 shrink-0 items-center gap-1 rounded-full bg-secondary px-3.5 text-[13px] font-bold text-foreground transition-colors hover:bg-primary-soft active:bg-primary-soft",
        className,
      )}
    >
      <ChevronLeft className="h-4 w-4" />
      Back
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
          className="inline-flex h-10 shrink-0 cursor-pointer items-center rounded-full bg-secondary px-5 text-[13px] font-bold text-foreground transition-colors hover:bg-primary-soft active:bg-primary-soft"
        >
          {action}
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
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-[13px] font-semibold",
        tone === "neutral" && "bg-secondary text-foreground",
        tone === "green" && "bg-primary-soft text-foreground",
        tone === "yellow" && "bg-accent-soft text-accent-foreground",
      )}
    >
      {children}
    </span>
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