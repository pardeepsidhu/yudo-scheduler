/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pale: "#e8d9c4",
        gold: "#785d32",
        rough: "#3e160c",
        "off-navy": "#2b3a55",
      },
    },
  },
  plugins: [],
};

export default config;
