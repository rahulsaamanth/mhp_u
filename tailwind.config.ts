import type { Config } from "tailwindcss"

const config = {
  theme: {
    extend: {
      fontFamily: {
        menco: ["Menco", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "var(--brand)",
          foreground: "var(--brand-foreground)",
          hover: "var(--brand-hover)",
          dardk: "var(--brand-dark)",
        },
      },
      backdropFilter: {
        none: "none",
        blur: "blur(20px)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
