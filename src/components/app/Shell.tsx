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
    <header className="sticky top-0 z-20 -mx-5 mb-4 border-b border-[var(--lo-fresh-sprout)] bg-background/95 px-5 pt-3 pb-3 backdrop-blur">
      <div className="flex items-center gap-2">
        {back && (
          <button
            type="button"
            aria-label="Go back"
            onClick={() => router.history.back()}
            className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary active:bg-secondary"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
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
    <div className="mt-7 mb-3 flex items-baseline justify-between">
      <h2 className="lo-display text-[19px]">{children}</h2>
      {action && to && (
        <Link to={to} className="text-[13px] font-bold text-primary hover:underline">
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
        variant === "accent"
          ? "border-2 border-foreground bg-card"
          : "bg-card ring-1 ring-[var(--lo-fresh-sprout)]",
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
}: {
  src: string;
  name: string;
  size?: number;
  className?: string;
}) {
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