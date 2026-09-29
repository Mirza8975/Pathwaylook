/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F5A46',
          dark: '#17352D',
        },
        secondary: {
          DEFAULT: '#3E7C72',
        },
        accent: {
          DEFAULT: '#C8795A',
        },
        background: {
          DEFAULT: '#F7F9F8',
        },
        body: {
          DEFAULT: '#42544E',
        },
        border: {
          DEFAULT: '#D9E3DF',
        },
        success: {
          DEFAULT: '#2E7D32',
          light: '#E8F5E9',
        },
        warning: {
          DEFAULT: '#C58B00',
          light: '#FFF8E1',
        },
        danger: {
          DEFAULT: '#C62828',
          light: '#FDECEC',
        }
      }
    },
  },
  plugins: [],
}
