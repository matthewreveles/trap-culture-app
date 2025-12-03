// src/components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import MobileMenu from "./MobileMenu";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

const CartIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="drop-shadow-[0_0_6px_rgba(255,122,42,0.4)]"
  >
    <circle cx="9" cy="21" r="1.5" />
    <circle cx="19" cy="21" r="1.5" />
    <path d="M5 4H7L9 16H20L22 8H8" />
  </svg>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { lang, setLang, dictionary } = useLanguage();
  const navCopy = dictionary.nav;

  return (
    <>
      <nav
        data-scrolled={scrolled}
        aria-label="Primary"
        className={`
          fixed inset-x-0 top-0 z-[80] h-16
          flex items-center
          backdrop-blur-md
          border-b
          bg-[#f8f8f8]/95 text-[#14081b]
          dark:bg-[#111119]/92 dark:text-white
          border-black/5 dark:border-white/10
        `}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 sm:px-4">
          {/* Left: Hamburger */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? navCopy.hamburgerClose : navCopy.hamburgerOpen}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-suns-purple via-suns-gray to-suns-black text-white shadow-lg transition-transform duration-200 hover:scale-105 dark:border-white/30"
          >
            <span className="sr-only">Toggle menu</span>
            <span className="block h-[3px] w-6 rounded bg-white shadow-sm" />
            <span className="my-1 block h-[3px] w-6 rounded bg-white shadow-sm" />
            <span className="block h-[3px] w-6 rounded bg-white shadow-sm" />
          </button>

          {/* Center: TRAP CULTURE wordmark */}
          <div className="flex flex-1 items-center justify-center">
            <div className="flex items-baseline gap-1 select-none">
              <span className="font-bebas text-2xl tracking-[0.18em] text-[#14081b] dark:text-white">
                TRAP
              </span>
              <span className="font-bebas text-2xl tracking-[0.18em] text-suns-orange">
                CULTURE
              </span>
            </div>
          </div>

          {/* Right: Cart + language toggle */}
          <div className="flex min-w-[150px] items-center justify-end gap-2">
            <Link
              href="/shop"
              aria-label={navCopy.cartLabel}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-[#f4f4f4] text-[#14081b] shadow-md transition-transform duration-200 hover:scale-105 dark:border-white/30 dark:bg-black/40 dark:text-white"
            >
              <CartIcon />
            </Link>

            <LanguageToggle value={lang} onChange={setLang} />
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={open} onOpenChange={setOpen} />
    </>
  );
}
