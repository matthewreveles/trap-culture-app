// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import { Racing_Sans_One, Bebas_Neue } from "next/font/google";

import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Trap Culture",
  description: "Trap Culture — Lifestyle, News, Events, Shop",
};

const racingSans = Racing_Sans_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-racing-sans",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Default to dark mode; a future theme toggle can switch this class
    <html lang="en" className="dark">
      <body
        className={`${bebasNeue.variable} ${racingSans.variable} min-h-screen flex flex-col`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
