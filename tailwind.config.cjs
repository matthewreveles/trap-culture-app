/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trapPurple: "#8c5bff",
        trapOrange: "#ff7a2a",
        trapGold: "#ffc857",
      },
      backgroundImage: {
        "trap-gradient": "linear-gradient(90deg, #8c5bff 0%, #ff7a2a 45%, #ffc857 100%)",
      },
      boxShadow: {
        "glass-lg": "0 20px 60px rgba(0,0,0,0.25)",
        "glass-sm": "0 10px 25px rgba(0,0,0,0.18)",
      },
      backdropBlur: {
        18: "18px",
      },
    },
  },
  plugins: [],
};
