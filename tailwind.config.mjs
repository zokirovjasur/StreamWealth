/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2c3e50",
        secondary: "#3498db",
        success: "#2ecc71",
        danger: "#e74c3c",
      },
    },
  },
  plugins: [],
};
