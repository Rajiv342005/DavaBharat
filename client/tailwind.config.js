/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#14804A", dark: "#0E5F37", light: "#E6F4EC" },
        ink: "#0E2A20",
        paper: "#F5F9F6",
        line: "#DAE5DE",
        saffron: { DEFAULT: "#F2A20C", light: "#FEF3DC" },
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        display: ['"Bricolage Grotesque"', '"DM Sans"', "sans-serif"],
      },
      boxShadow: {
        lift: "0 10px 28px -14px rgba(14, 42, 32, 0.35)",
      },
    },
  },
  plugins: [],
};

