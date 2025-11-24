import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['Bebas Neue', 'sans-serif'],
        racing: ['Racing Sans One', 'sans-serif'],
      },
      colors: {
        'suns-orange': '#FF7A2A',
        'suns-purple': '#8C5BFF',
        'suns-deep-purple': '#1D1160',
        'suns-main-orange': '#E56020',
        'suns-gold': '#FFC857',
        'suns-black': '#000000',
        'suns-gray': '#63727A',
        'suns-white': '#FFFFFF',
        'light-bg': '#F8F8F8', // Soft white background
        'light-surface': '#FFFFFF',
        'light-border': '#E5E7EB',
        'light-text': '#232323',
        'light-accent': '#FF7A2A', // Orange accent
      },
      backgroundImage: {
        'gradient-lit': 'linear-gradient(90deg, #8C5BFF 0%, #FF7A2A 45%, #FFC857 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;
