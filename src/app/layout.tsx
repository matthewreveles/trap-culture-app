// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

// Load Google Fonts correctly
import { Racing_Sans_One, Bebas_Neue } from "next/font/google";

import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Trap Culture",
  description: "Trap Culture — Lifestyle, News, Events, Shop",
};

// Racing Sans One (used specifically for TRAP NEWS header)
const racingSans = Racing_Sans_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-racing-sans",
  display: "swap",
});

// Bebas Neue (default font for the app)
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
    <html lang="en">
      <body
        className={`${bebasNeue.className} ${racingSans.variable} bg-black text-white min-h-screen flex flex-col antialiased`}
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
