import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#fbf7f2",
          100: "#f2e6d8",
          300: "#c99b72",
          500: "#8c5a35",
          700: "#55341f",
          900: "#2a1a11"
        }
      }
    }
  },
  plugins: []
};

export default config;
