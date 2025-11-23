// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeToggleFab from "@/components/ThemeToggleFab";
import { bebasNeue, fontVars } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Trap Culture",
  description: "Trap Culture — Lifestyle, News, Events, Shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.className} ${fontVars} bg-black text-white min-h-screen flex flex-col antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <ThemeToggleFab />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
