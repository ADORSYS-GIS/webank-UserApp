/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        'primary-content': 'var(--primary-content-color)',
        'primary-light': 'var(--primary-light-color)',
        secondary: 'var(--secondary-color)',
        'secondary-content': 'var(--secondary-content-color)',
        'secondary-light': 'var(--secondary-light-color)',
        success: 'var(--success-color)',
        'success-content': 'var(--success-content-color)',
        'success-light': 'var(--success-light-color)',
        neutral: 'var(--neutral-color)',
        'neutral-content': 'var(--neutral-content-color)',
        'neutral-light': 'var(--neutral-light-color)',
        danger: 'var(--danger-color)',
        'danger-content': 'var(--danger-content-color)',
        'danger-light': 'var(--danger-light-color)',
      },
    },
  },
  plugins: [],
}