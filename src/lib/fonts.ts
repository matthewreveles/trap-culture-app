import { Bebas_Neue, Racing_Sans_One } from "next/font/google";

// Bebas Neue is the primary display face used throughout the app
export const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

// Racing Sans One is reserved for the TRAP NEWS masthead and accents
export const racingSans = Racing_Sans_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-racing-sans",
  display: "swap",
});

// Export a convenience string for applying both variables at once
export const fontVars = `${bebasNeue.variable} ${racingSans.variable}`;
