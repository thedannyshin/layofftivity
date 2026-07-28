import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
        <div className="min-w-0 flex-1">
          <h1 className="lo-display truncate text-[20px] leading-tight">{title}</h1>
          {subtitle && <p className="truncate text-[13px] text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
        {back && (
          <button
            type="button"
            aria-label="Go back"
            onClick={() => router.history.back()}
            className="flex h-11 shrink-0 items-center gap-1 rounded-full bg-secondary px-3.5 text-[13px] font-bold text-foreground transition-colors hover:bg-primary-soft active:bg-primary-soft"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
        )}
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
    <div className="mt-7 mb-3 flex items-baseline justify-between">
      <h2 className="lo-display text-[19px]">{children}</h2>
      {action && to && (
        <Link
          to={to}
          className="rounded-full bg-secondary px-3 py-1.5 text-[13px] font-bold text-primary transition-colors hover:bg-primary-soft active:bg-primary-soft"
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
        "rounded-[20px] p-4",
        variant === "accent" ? "bg-primary-soft" : "bg-card",
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