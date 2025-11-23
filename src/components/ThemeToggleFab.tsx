"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

type MotionPreference = "reduce" | "no-preference";

export default function ThemeToggleFab() {
  const { theme, toggleTheme, mounted } = useTheme();
  const [motionPreference, setMotionPreference] = useState<MotionPreference>("no-preference");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = (event: MediaQueryListEvent | MediaQueryList) => {
      setMotionPreference(event.matches ? "reduce" : "no-preference");
    };

    updatePreference(media);
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  if (!mounted) {
    return null;
  }

  const isLight = theme === "light";

  const handleToggle = () => {
    toggleTheme();

    if (motionPreference === "reduce") return;
    if ("vibrate" in navigator && typeof navigator.vibrate === "function") {
      navigator.vibrate(18);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="fixed left-4 bottom-6 sm:left-6 sm:bottom-8 z-[90] inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/70 px-2.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_32px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:border-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <span
        className="relative flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-white/85"
      >
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-black shadow-[0_0_8px_rgba(255,255,255,0.6)] ring-1 ring-white/70 transition dark:bg-zinc-900 dark:text-amber-200 dark:ring-white/20"
          aria-hidden
        >
          {isLight ? "☀︎" : "☾"}
        </span>
        <span className="text-[0.7rem] tracking-[0.16em]">
          {isLight ? "Light" : "Dark"}
        </span>
      </span>
    </button>
  );
}
