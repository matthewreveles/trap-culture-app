// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        // optional: tiny tune for your brand glow helpers
      },
      boxShadow: {
        'tc-soft': '0 10px 30px rgba(0,0,0,0.35)'
      }
    }
  },
  plugins: []
};

export default config;
