/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html" // Legger til public-mappen for å sikre at alle filer blir analysert
  ],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'hsl(var(--border))'
      }
    },
  },
  plugins: [],
}
