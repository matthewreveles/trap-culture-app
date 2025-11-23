"use client";

import Image from "next/image";
import { useTheme } from "./ThemeProvider";

export default function Footer() {
  const { theme, mounted } = useTheme();
  const logoSrc = !mounted
    ? "/trapculturehoriz.png"
    : theme === "light"
      ? "/trapculturehorizblack.png"
      : "/trapculturehoriz.png";

  return (
    <footer className="mt-auto border-t border-white/10 bg-gradient-to-b from-zinc-900/30 to-black">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-white/70 space-y-3">
        <div className="flex justify-center">
          <Image
            src={logoSrc}
            alt="Trap Culture"
            width={240}
            height={70}
            className="h-10 w-auto"
            priority
          />
        </div>
        <div>© {new Date().getFullYear()} Trap Culture. All rights reserved.</div>
      </div>
    </footer>
  );
}
