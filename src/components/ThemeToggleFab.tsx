import { useEffect, useState } from "react";

// Neon/glass style sun and moon SVGs
const SunIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`transition-all duration-300 ${active ? 'drop-shadow-[0_0_8px_#FFC857]' : ''}`}> 
    <circle cx="12" cy="12" r="5" fill="#FFC857" />
    <g stroke="#FFC857" strokeWidth="2">
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </g>
  </svg>
);

const MoonIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`transition-all duration-300 ${active ? 'drop-shadow-[0_0_8px_#8C5BFF]' : ''}`}> 
    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="#8C5BFF" />
  </svg>
);

export default function ThemeToggleFab() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  if (!mounted) return null;

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="mx-auto mt-6 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-lg p-3 neon-fab transition-all duration-300 hover:scale-105 focus:outline-none"
      style={{ boxShadow: theme === 'dark' ? '0 0 12px #8C5BFF' : '0 0 12px #FFC857' }}
    >
      <span className="sr-only">Toggle theme</span>
      <span className="relative flex items-center w-10 h-6">
        <span
          className={`absolute left-0 top-0 transition-all duration-500 ${theme === 'dark' ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}
        >
          <SunIcon active={theme === 'light'} />
        </span>
        <span
          className={`absolute right-0 top-0 transition-all duration-500 ${theme === 'dark' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        >
          <MoonIcon active={theme === 'dark'} />
        </span>
      </span>
    </button>
  );
}
