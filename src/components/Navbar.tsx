"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        data-scrolled={scrolled}
        aria-label="Primary"
        className="glass-nav fixed inset-x-0 top-0 z-[80] h-16 flex items-center justify-between px-3 sm:px-4"
      >
        {/* Hamburger */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(v => !v)}
          className="hamburger-bg flex h-10 w-10 items-center justify-center rounded-xl border border-white/70"
        >
          <span className="sr-only">Toggle menu</span>
          <span className="block h-[2px] w-5 bg-white" />
          <span className="block h-[2px] w-5 bg-white my-1" />
          <span className="block h-[2px] w-5 bg-white" />
        </button>

        {/* Center text logo */}
        <Link
          href="/"
          className="trap-brand mx-auto"
          aria-label="Trap Culture home"
        >
          <span className="font-semibold">TRAP</span>
          <span className="text-orange-400"> CULTURE</span>
        </Link>

        <div className="h-10 w-10" aria-hidden />
      </nav>

      <MobileMenu isOpen={open} onOpenChange={setOpen} />
    </>
  );
}
