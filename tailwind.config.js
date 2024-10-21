/** @type {import('tailwindcss').Config} */

module.exports = {

  content: ["./src/**/*.{html,js,ts,tsx}"],

  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },

  plugins: [
    require('daisyui'),
  ],

}
