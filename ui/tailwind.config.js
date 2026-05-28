/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        shopify: {
          50:  "#f0faf4",
          100: "#d9f2e3",
          200: "#b4e5c8",
          300: "#80d1a6",
          400: "#4ab680",
          500: "#008060",
          600: "#006b50",
          700: "#005542",
          800: "#004435",
          900: "#00362b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
