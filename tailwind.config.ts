import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#6A0DAD",
          accent: "#FF6A00",
        },
      },
    },
  },
};

export default config;
