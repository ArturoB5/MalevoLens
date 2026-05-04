import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./presentation/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          base: "#070a12",
          raised: "#0d1320",
          muted: "#121a2a"
        },
        signal: {
          normal: "#38bdf8",
          warning: "#facc15",
          compromised: "#fb7185",
          protected: "#34d399"
        }
      },
      boxShadow: {
        glow: "0 0 32px rgba(56, 189, 248, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
