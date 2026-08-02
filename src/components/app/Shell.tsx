import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
export const tapCard = `${cardBase} bg-card ${tapBase}`;

/** Tappable accent card. */
export const tapCardAccent = `${cardBase} bg-accent-soft ${tapBase} hover:bg-accent-soft/80 active:bg-accent-soft/70`;

/**
 * Grouped list: many tappable rows share ONE container instead of one box each.
 * Use <ListGroup> around rows that use `tapRow`.
 */
export const tapRow = `flex w-full items-center gap-3 px-4 py-3.5 bg-card ${tapBase}`;

export function ListGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl bg-card", className)}>
      <div className="divide-y divide-background">{children}</div>
    </div>
  );
}

/** Tappable pill (chips, quick replies, filters) — same language as Button. */
export const tapPill =
  "inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-[13px] font-semibold text-primary-foreground cursor-pointer transition-colors duration-[120ms] hover:bg-primary/90 active:bg-primary/85 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft";

/** Selected state of a tappable pill. */
export const tapPillActive =
  "inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-[13px] font-semibold text-primary-foreground cursor-pointer transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft";

/** One shared look for selectable option rows (onboarding, invite, continue together). */
export function selectRow(selected: boolean) {
  return cn(
    "flex w-full items-center gap-3 rounded-2xl p-4 text-left cursor-pointer transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft",
    selected ? "bg-accent-soft" : "bg-card",
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
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-muted-foreground/35 bg-transparent text-foreground transition-colors hover:bg-card active:bg-card active:opacity-70",
        className,
      )}
    >
      <ArrowLeft className="h-5 w-5" aria-hidden />
    </button>
  );
}

export function ScreenHero({
  title,
  eyebrow,
  subtitle,
  back,
  right,
  onTitleClick,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
  /** @deprecated Large titles always collapse into a compact iOS-style bar on scroll. */
  sticky?: boolean;
  /** Optional tap handler for the title (e.g. hidden reset gesture). */
  onTitleClick?: () => void;
}) {
  const router = useRouter();
  const barRef = useRef<HTMLDivElement>(null);
  const largeTitleRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const alwaysShowBar = !!back || !!right;

  useEffect(() => {
    const titleEl = largeTitleRef.current;
    if (!titleEl) return;

    const update = () => {
      const titleTop = titleEl.getBoundingClientRect().top;
      if (alwaysShowBar && barRef.current) {
        setCompact(titleTop <= barRef.current.getBoundingClientRect().bottom - 2);
        return;
      }
      // Approx. status-bar clearance when no persistent nav chrome.
      setCompact(titleTop < 52);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [title, alwaysShowBar]);

  const compactLabel = onTitleClick ? (
    <button type="button" onClick={onTitleClick} className="max-w-full">
      <span className="block truncate text-center text-[17px] font-semibold tracking-tight">
        {title}
      </span>
    </button>
  ) : (
    <p className="truncate text-center text-[17px] font-semibold tracking-tight">{title}</p>
  );

  const barInner = (
    <div className="relative mx-auto flex h-11 w-full max-w-[430px] items-center px-5">
      <div className="relative z-10 flex w-11 shrink-0 items-center justify-start">
        {back && <BackButton onClick={() => router.history.back()} />}
      </div>
      <div
        className={cn(
          "absolute inset-x-16 flex items-center justify-center transition-opacity duration-200",
          compact ? "opacity-100" : "opacity-0",
        )}
      >
        {compactLabel}
      </div>
      <div className="relative z-10 ml-auto flex min-w-11 shrink-0 items-center justify-end">
        {right}
      </div>
    </div>
  );

  return (
    <>
      {alwaysShowBar ? (
        <div
          ref={barRef}
          className={cn(
            "sticky top-0 z-20 -mx-5 bg-background pt-[max(0.5rem,env(safe-area-inset-top))] transition-[box-shadow] duration-200",
            compact &&
              "shadow-[inset_0_-0.5px_0_0_color-mix(in_oklab,var(--color-foreground)_14%,transparent)]",
          )}
        >
          {barInner}
        </div>
      ) : (
        <div
          className={cn(
            "pointer-events-none fixed inset-x-0 top-0 z-30 bg-background pt-[max(0.5rem,env(safe-area-inset-top))] transition-[opacity,transform] duration-200 ease-out",
            compact
              ? "pointer-events-auto translate-y-0 opacity-100 shadow-[inset_0_-0.5px_0_0_color-mix(in_oklab,var(--color-foreground)_14%,transparent)]"
              : "-translate-y-1 opacity-0",
          )}
          aria-hidden={!compact}
        >
          {barInner}
        </div>
      )}

      <div
        className={cn(
          "mb-4",
          alwaysShowBar ? "pt-1" : "pt-[max(1.5rem,env(safe-area-inset-top))]",
        )}
      >
        {eyebrow && (
          <p className="text-[13px] font-semibold text-muted-foreground">{eyebrow}</p>
        )}
        <div ref={largeTitleRef}>
          {onTitleClick ? (
            <button
              type="button"
              onClick={onTitleClick}
              className={cn(
                "lo-display block w-full truncate whitespace-nowrap text-left text-[34px] leading-[1.1]",
                eyebrow && "mt-1",
              )}
            >
              {title}
            </button>
          ) : (
            <h1
              className={cn(
                "lo-display truncate whitespace-nowrap text-[34px] leading-[1.1]",
                eyebrow && "mt-1",
              )}
            >
              {title}
            </h1>
          )}
        </div>
        {subtitle && (
          <p className="mt-1 truncate text-[15px] text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </>
  );
}

/** @deprecated Use ScreenHero — kept as an alias during migration. */
export const TopBar = ScreenHero;

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
}: {
  children: ReactNode;
  /** Kept for call-site compatibility; all static chips render one neutral style. */
  tone?: "neutral" | "green";
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-muted-foreground/40 px-3 py-1 text-[13px] font-semibold text-muted-foreground">
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
      {parts.join(", ")}
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
          aria-label={open ? "Show less" : "Show more"}
          className="mt-1.5 inline-flex cursor-pointer items-center rounded-full border border-muted-foreground/35 bg-transparent p-1 text-foreground transition-colors hover:bg-card active:bg-card"
        >
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 scroll-smooth gap-3 overflow-x-auto overscroll-x-contain px-5 pb-1 [-webkit-overflow-scrolling:touch]">
      {children}
    </div>
  );
}

export const deckItem =
  "w-[78%] shrink-0 snap-start snap-always rounded-2xl bg-card p-4";

/** Tappable card inside a horizontal deck/carousel (photo on top, text below). */
export const deckCard = `w-[78%] shrink-0 snap-start snap-always overflow-hidden rounded-2xl bg-card ${tapBase}`;

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