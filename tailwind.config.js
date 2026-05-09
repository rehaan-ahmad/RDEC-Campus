/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': 'var(--bg-deep)',
        'bg-mid': 'var(--bg-mid)',
        'glass-fill': 'var(--glass-fill)',
        'glass-fill-hover': 'var(--glass-fill-hover)',
        'glass-border': 'var(--glass-border)',
        'blue': 'var(--blue)',
        'teal': 'var(--teal)',
        'violet': 'var(--violet)',
        'gold': 'var(--gold)',
        'orange': 'var(--orange)',
        'white': 'var(--white)',
        'muted': 'var(--muted)',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        heading: ['Syne', 'sans-serif'],
        body: ['Satoshi', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'card': 'var(--r-card)',
        'button': 'var(--r-button)',
        'pill': 'var(--r-pill)',
      },
      transitionDuration: {
        'fast': 'var(--t-fast)',
        'base': 'var(--t-base)',
        'spring': 'var(--t-spring)',
      },
    },
  },
  plugins: [],
}