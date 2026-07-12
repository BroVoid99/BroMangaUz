import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0E0D10",       // near-black background
        parchment: "#F4EEDD", // off-white text on dark
        gold: {
          DEFAULT: "#C9A227",
          light: "#E0C158",
          dark: "#8F7318"
        },
        seal: "#8B1E24",      // hanko red for badges
        panel: "#17151A",     // card surface, slightly lifted off ink
        line: "#2A2730"       // hairline borders
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"]
      },
      backgroundImage: {
        "torn-edge": "url('/textures/torn-edge.svg')"
      },
      letterSpacing: {
        widest2: "0.25em"
      }
    }
  },
  plugins: []
};

export default config;
