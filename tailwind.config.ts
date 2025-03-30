import type { Config } from "tailwindcss";

const config = {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--brand)",
          foreground: "var(--brand-foreground)",
          hover: "var(--brand-hover)",
        },
      },
    },
  },
} satisfies Config;

export default config;
