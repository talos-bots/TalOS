/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  media: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        black: "#000",
        lime: {
          "100": "rgba(3, 179, 0, 0.25)",
          "200": "rgba(0, 255, 26, 0.25)",
        },
      },
      "fontFamily": {
        "inter": ["Inter", "sans-serif"],
      },
      "borderRadius": {
        "6xl": "25px",
        "81xl": "100px"
      },
      "fontSize": {
        "lg": "18px"
      },
      width: {
        '5vw': '5vw',
        '10vw': '10vw',
        '15vw': '15vw',
        '20vw': '20vw',
        '25vw': '25vw',
        '30vw': '30vw',
        '35vw': '35vw',
        '40vw': '40vw',
        '45vw': '45vw',
        '50vw': '50vw',
        '55vw': '55vw',
        '60vw': '60vw',
        '65vw': '65vw',
        '70vw': '70vw',
        '75vw': '75vw',
        '80vw': '80vw',
        '85vw': '85vw',
        '90vw': '90vw',
        '95vw': '95vw',
        '100vw': '100vw',
      },
      height: {
        '5vh': '5vh',
        '10vh': '10vh',
        '15vh': '15vh',
        '20vh': '20vh',
        '25vh': '25vh',
        '30vh': '30vh',
        '35vh': '35vh',
        '40vh': '40vh',
        '45vh': '45vh',
        '50vh': '50vh',
        '55vh': '55vh',
        '60vh': '60vh',
        '65vh': '65vh',
        '75vh': '75vh',
        '80vh': '80vh',
        '85vh': '85vh',
        '90vh': '90vh',
        '95vh': '95vh',
        '100vh': '100vh',
      },
      backgroundColor: {
        'theme-root': 'var(--theme-root)',
        'theme-accent': 'var(--theme-accent)',
        'theme-italic': 'var(--theme-italic)',
        'theme-text': 'var(--theme-text)',
        'theme-button': 'var(--theme-button)',
        'theme-box': 'var(--theme-box)',
        'theme-hover-pos': 'var(--theme-hover-pos)',
        'theme-hover-neg': 'var(--theme-hover-neg)',
      },
      textColor: {
        'theme-text': 'var(--theme-text)',
        'theme-accent': 'var(--theme-accent)',
        'theme-italic': 'var(--theme-italic)',
        'theme-text-hover': 'var(--theme-text-hover)',
      },
      borderColor: {
        'theme-border': 'var(--theme-border)',
        'theme-button': 'var(--theme-button)',
        'theme-accent': 'var(--theme-accent)',
      },
      backdropBlur: {
        'theme-blur': 'var(--theme-blur)',
      },
      borderWidth: {
        'theme-border-width': 'var(--theme-border-width)',
      },
      borderRadius: {
        'theme-border-radius': 'var(--theme-border-radius)',
      },
    },
  },
  variants: {
      extend: {
        backdropBlur: ['responsive'],
      },
  },
  plugins: [
    require('tailwindcss-textshadow'),
  ],
};
