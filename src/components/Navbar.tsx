"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

  const [logoSrc, setLogoSrc] = useState("/trapculturehoriz.png");
  const fallbackLogo = "/trapculturehorizwithface.png";

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
        className="fixed inset-x-0 top-0 z-[80] h-16 flex items-center justify-between px-3 sm:px-4
                   bg-black/30 backdrop-blur-md border-b border-white/10"
      >
        {/* Hamburger */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? navCopy.hamburgerClose : navCopy.hamburgerOpen}
          onClick={() => setOpen(v => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-suns-purple via-suns-gray to-suns-black shadow-lg border-2 border-white/30 hover:scale-105 transition-transform duration-200"
        >
          <span className="sr-only">Toggle menu</span>
          <span className="block h-[3px] w-6 rounded bg-white shadow-sm" />
          <span className="block h-[3px] w-6 rounded bg-white my-1 shadow-sm" />
          <span className="block h-[3px] w-6 rounded bg-white shadow-sm" />
        </button>

        {/* Centered TRAP CULTURE text */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center select-none">
          {/* TRAP: white in dark, black in light; CULTURE: orange in both */}
          <span className="font-bebas text-3xl tracking-wide mr-2 text-white light:text-black">TRAP</span>
          <span className="font-bebas text-3xl tracking-wide text-suns-orange !text-suns-orange" style={{ color: '#FF7A2A' }}>CULTURE</span>
        </div>

        {/* Cart + language toggle */}
        <div className="flex items-center justify-end gap-2 min-w-[150px]">
          <Link
            href="/shop"
            aria-label={navCopy.cartLabel}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/40 backdrop-blur-md text-white shadow-lg transition-transform duration-200 hover:scale-105"
          >
            <CartIcon />
          </Link>
          <LanguageToggle value={lang} onChange={setLang} />
        </div>
      </nav>

      <MobileMenu isOpen={open} onOpenChange={setOpen} />
    </>
  );
}
