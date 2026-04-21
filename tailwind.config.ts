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
        // Brand palette
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5", // Accent: Soft indigo
          700: "#4338ca",
          900: "#322f52ff",
        },
        accent: {
          400: "#34d399",
          500: "#065f46", // Muted green
          600: "#064e3b",
        },
        chat: {
          bg: "#111827", // Background: Soft dark grey
          surface: "#1f2937", // Chat Background: Slightly lighter
          border: "#374151", // Border: Neutral grey
          bubble: "#1f2937",
          user: "#065f46", // User Message: Muted green
          assistant: "#374151", // Bot Message: Neutral grey
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.35s ease-out",
        "pulse-dot": "pulseDot 1.4s infinite ease-in-out",
        "typing": "typing 1.2s steps(3, end) infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        pulseDot: { "0%,80%,100%": { transform: "scale(0)" }, "40%": { transform: "scale(1)" } },
        typing: { "0%": { width: "0" }, "100%": { width: "100%" } },
      },
    },
  },
  plugins: [],
};
export default config;
