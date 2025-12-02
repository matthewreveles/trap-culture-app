// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ["Bebas Neue", "sans-serif"],
        racing: ["Racing Sans One", "sans-serif"],
      },
      colors: {
        // Legacy Suns palette (still useful in spots)
        "suns-orange": "#FF7A2A",
        "suns-purple": "#8C5BFF",
        "suns-deep-purple": "#1D1160",
        "suns-main-orange": "#E56020",
        "suns-gold": "#FFC857",
        "suns-black": "#000000",
        "suns-gray": "#63727A",
        "suns-white": "#FFFFFF",

        // Trap Culture core
        "trap-purple-dark": "#14081b",
        "trap-purple": "#8C5BFF",
        "trap-orange": "#FF7A2A",
        "trap-orange-soft": "rgba(255,122,42,0.12)",

        // App surfaces / text
        "trap-bg-dark": "#050509",
        "trap-bg-light": "#F8F8F8",
        "trap-surface-dark": "#111119",
        "trap-surface-light": "#FFFFFF",
        "trap-border-light": "#E5E7EB",
        "trap-text-dark": "#F9FAFB",
        "trap-text-light": "#232323",
      },
      backgroundImage: {
        "gradient-lit":
          "linear-gradient(90deg, #8C5BFF 0%, #FF7A2A 45%, #FFC857 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
