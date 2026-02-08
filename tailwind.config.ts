import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          50: "#f8f6fc",
          100: "#f0ebf8",
          200: "#e2d8f2",
          300: "#cebfe8",
          400: "#b49ddb",
          500: "#9b7fcc",
          600: "#8466b8",
          700: "#6d50a0",
          800: "#5a4285",
          900: "#4a3670",
          950: "#2d1f47",
        },
        linen: {
          50: "#fdfcfa",
          100: "#f9f5ef",
          200: "#f2ebe0",
          300: "#e8dbca",
          400: "#d6c2a8",
          500: "#c5a98a",
          600: "#b08f6e",
          700: "#96765a",
          800: "#7c624d",
          900: "#665141",
          950: "#362a21",
        },
        stone: {
          50: "#faf9f7",
          100: "#f0eeea",
          200: "#e2ded7",
          300: "#cfc9be",
          400: "#b5ac9d",
          500: "#a09686",
          600: "#8a7e6f",
          700: "#73695d",
          800: "#61584f",
          900: "#524b43",
          950: "#2b2723",
        },
      },
      fontFamily: {
        serif: ["var(--font-lora)", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
