/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          900: "#14532d",
        },
        sidebar: "#111111",
        ink: "#111827",
        line: "#e5e7eb",
        darkline: "#2a2a2a",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)",
      },
      fontFamily: {
        sans: [
          "DM Sans",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
