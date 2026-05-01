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
        matka: {
          bg: "#F0FFF4", // Light Green
          accent: "#D4AF37", // Light Gold
          text: "#1F2937", // Deep Slate/Charcoal
          danger: "#EF4444", // Blinking red
        },
      },
      animation: {
        "blink-dot": "blink 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-gold": "pulseGold 2s infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        pulseGold: {
          "0%": { boxShadow: "0 0 0 0 rgba(212, 175, 55, 0.7)" },
          "70%": { boxShadow: "0 0 0 10px rgba(212, 175, 55, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(212, 175, 55, 0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
