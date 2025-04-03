import type { Config } from "tailwindcss"

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
      backdropFilter: {
        none: "none",
        blur: "blur(20px)",
      },
    },
  },
  // variants: {
  //   extend: {
  //     backdropFilter: ['responsive'],
  //   },
  // },
} satisfies Config

export default config
