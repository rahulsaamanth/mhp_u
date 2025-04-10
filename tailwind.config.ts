import type { Config } from "tailwindcss"

const config = {
  theme: {
    extend: {
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
  plugins: [
    // function ({
    //   addUtilities,
    // }: {
    //   addUtilities: (utilities: Record<string, any>, options?: object) => void
    // }) {
    //   const newUtilities = {
    //     ".underline-animate": {
    //       position: "relative",
    //       display: "inline-block",
    //       "padding-bottom": "2px",
    //       "&::after": {
    //         content: '""',
    //         position: "absolute",
    //         bottom: "0",
    //         left: "0",
    //         width: "0%",
    //         height: "2px",
    //         backgroundColor: "currentColor",
    //         transition: "width 0.3s ease-in-out"
    //       },
    //       "&:hover::after, &:focus::after": {
    //         width: "100%"
    //       }
    //     },
    //     ".animation-delay-200": {
    //       "animation-delay": "200ms",
    //     },
    //     ".animation-delay-400": {
    //       "animation-delay": "400ms",
    //     },
    //   }
    //   addUtilities(newUtilities)
    // },
  ],
} satisfies Config

export default config
