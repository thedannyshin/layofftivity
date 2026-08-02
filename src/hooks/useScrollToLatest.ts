import * as React from "react";

/**
 * Keeps the latest chat content above the fixed composer without
 * scrollIntoView's block:"end" jump (which can scroll upward on short pages).
 */
export function useScrollToLatest(
  endRef: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList,
  bottomPad = 140,
) {
  React.useLayoutEffect(() => {
    const el = endRef.current;
    if (!el) return;

    const frame = requestAnimationFrame(() => {
      const target =
        el.getBoundingClientRect().bottom + window.scrollY - (window.innerHeight - bottomPad);
      window.scrollTo({ top: Math.max(0, target), behavior: "auto" });
    });

    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
