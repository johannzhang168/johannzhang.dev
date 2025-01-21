module.exports = {
  content: [
    "./index.html", // Include your root HTML file
    "./app/**/*.{ts,tsx}", // Include all React components in the app folder
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          50: "#f7f4ef",
          100: "#ebe5d6",
          200: "#d9ccaf",
          300: "#c2ab82",
          400: "#b0905f",
          500: "#9f7c50",
          600: "#8a6544",
          700: "#6f4e39",
          800: "#5f4234",
          900: "#523a31",
          950: "#2f1f19",
        }
      },
      fontFamily: {
        times: ['"Times New Roman"', "serif"],
        mono: ['"Roboto Mono"', 'monospace'],
      },

    },
  },
  plugins: [],
};
