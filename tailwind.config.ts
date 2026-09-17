import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "jh-green": "var(--jh-green)",
        "jh-green-dark": "var(--jh-green-dark)",
        "jh-yellow": "var(--jh-yellow)",
        "jh-orange": "var(--jh-orange)",
        "jh-blue": "var(--jh-blue)",
        "jh-sand": "var(--jh-sand)",
        "jh-ink": "var(--jh-ink)",
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        jh: "14px",
      },
    },
  },
  plugins: [],
}

export default config
