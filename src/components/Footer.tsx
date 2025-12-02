// src/components/Footer.tsx
"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { dictionary } = useLanguage();
  const footerCopy = dictionary.footer;

  const year = new Date().getFullYear();

  return (
    <footer className="tc-footer mt-auto">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-6">
        {/* Dark-mode logo */}
        <Image
          src="/trapculturehoriz.png"
          alt="Trap Culture Logo"
          width={260}
          height={64}
          className="tc-footer-logo-dark mb-2"
          priority
        />
        {/* Light-mode logo (black) */}
        <Image
          src="/trapculturehorizblack.png"
          alt="Trap Culture Logo Black"
          width={260}
          height={64}
          className="tc-footer-logo-light mb-2"
          priority
        />

        <div className="tc-footer-text text-center text-sm text-white/70">
          © {year} Trap Culture. {footerCopy.rights}
        </div>
      </div>
    </footer>
  );
}
