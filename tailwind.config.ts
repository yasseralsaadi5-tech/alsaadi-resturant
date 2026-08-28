import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#A8242C",
          "red-dark": "#7A1A20",
          "red-light": "#C43A42",
        },
        charcoal: {
          DEFAULT: "#211D1B",
          soft: "#332D2A",
        },
        cream: {
          DEFAULT: "#FBF5EF",
          deep: "#F3E9DD",
        },
        amber: {
          DEFAULT: "#C97A2E",
          soft: "#E0A25E",
        },
        stone: {
          DEFAULT: "#8A8078",
          light: "#C9C0B7",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      clipPath: {
        slice: "polygon(0 12%, 100% 0, 100% 88%, 0 100%)",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "cart-pop": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.4s ease-out",
        "cart-pop": "cart-pop 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
