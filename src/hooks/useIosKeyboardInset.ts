import { useEffect } from "react";

/**
 * Keeps --ios-keyboard-inset updated so fixed footers can sit above the iOS keyboard.
 */
export function useIosKeyboardInset() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const vv = window.visualViewport;

    const update = () => {
      if (!vv) {
        root.style.setProperty("--ios-keyboard-inset", "0px");
        return;
      }
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      root.style.setProperty("--ios-keyboard-inset", `${Math.round(inset)}px`);
    };

    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("orientationchange", update);
    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("orientationchange", update);
      root.style.setProperty("--ios-keyboard-inset", "0px");
    };
  }, []);
}
