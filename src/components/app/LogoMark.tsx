import { cn } from "@/lib/utils";

/**
 * Layofftivity mark — a jumping figure inside a ring, from the Touch Grass brand kit.
 * Minimum digital size is 24px.
 */
export function LogoMark({ size = 64, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label="Layofftivity mark"
      className={cn("shrink-0", className)}
    >
      <circle cx="60" cy="60" r="48" fill="none" stroke="var(--lo-grass-green)" strokeWidth="9" />
      <circle cx="60" cy="35" r="8.5" fill="var(--lo-dark-green)" />
      <g stroke="var(--lo-dark-green)" strokeWidth="7" strokeLinecap="round" fill="none">
        <path d="M60 47 L60 63" />
        <path d="M60 51 L44 39" />
        <path d="M60 51 L76 39" />
        <path d="M60 63 L49 76" />
        <path d="M60 63 L71 76" />
      </g>
    </svg>
  );
}