"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return <div className="h-10 w-10" aria-hidden />;
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/70 bg-white/5 text-lg transition hover:border-white hover:bg-white/10"
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      <span role="img" aria-hidden>
        {isLight ? "🌞" : "🌜"}
      </span>
    </button>
  );
}
