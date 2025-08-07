/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.{html,liquid,json}",
    "./sections/**/*.{html,liquid}",
    "./snippets/**/*.{html,liquid}",
    "./layout/**/*.{html,liquid}",
    "./assets/**/*.{js,liquid}"
  ],
  prefix: 'tw-',
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // Disable preflight to avoid conflicts with existing theme styles
    preflight: false,
  }
}
