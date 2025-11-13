"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./MobileMenu";

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
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(v => !v)}
          className="hamburger-bg flex h-10 w-10 items-center justify-center rounded-xl border border-white/70"
        >
          <span className="sr-only">Toggle menu</span>
          <span className="block h-[2px] w-5 bg-white" />
          <span className="block h-[2px] w-5 bg-white my-1" />
          <span className="block h-[2px] w-5 bg-white" />
        </button>

        {/* Center logo */}
        <Link href="/" className="mx-auto select-none" aria-label="Trap Culture home">
          <Image
            src={logoSrc}
            alt="Trap Culture"
            width={520}
            height={128}
            priority
            className="h-8 w-auto sm:h-10"
            onError={() => setLogoSrc(fallbackLogo)}
          />
        </Link>

        <div className="h-10 w-10" />
      </nav>

      <MobileMenu isOpen={open} onOpenChange={setOpen} />
    </>
  );
}
