import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-roboto)", "sans-serif"],
      },
    },
  },
};

export default config;