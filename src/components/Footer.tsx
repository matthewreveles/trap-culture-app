"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { dictionary } = useLanguage();
  const footerCopy = dictionary.footer;
  return (
    <footer className="mt-auto border-t border-white/10 bg-gradient-to-b from-zinc-900/30 to-black light:bg-light-bg light:border-light-border light:bg-none">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col items-center gap-2">
        {/* Show black logo in light mode, default in dark */}
        <Image
          src="/trapculturehoriz.png"
          alt="Trap Culture Logo"
          width={260}
          height={64}
          className="mb-2 block dark:block light:hidden"
        />
        <Image
          src="/trapculturehorizblack.png"
          alt="Trap Culture Logo Black"
          width={260}
          height={64}
          className="mb-2 hidden light:block"
        />
        <div className="text-center text-sm text-white/70 light:text-suns-purple">
          © {new Date().getFullYear()} Trap Culture. {footerCopy.rights}
        </div>
      </div>
    </footer>
  );
}
