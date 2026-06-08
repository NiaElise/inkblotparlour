/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0c090a',
          light: '#1a1315',
          warm: '#2c1f1a',
        },
        parchment: {
          DEFAULT: '#e8ddd0',
          light: '#f5ede3',
          dark: '#c4b5a5',
          muted: '#a08f7c',
        },
        sepia: {
          DEFAULT: '#8b6f47',
          light: '#a8885a',
          dark: '#6b5536',
        },
        blood: {
          DEFAULT: '#8b2a2a',
          light: '#b84040',
          dark: '#5e1c1c',
        },
        inkwell: {
          DEFAULT: '#1e1b18',
          light: '#2d2824',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Crimson Pro', 'serif'],
        body: ['Source Serif 4', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        script: ['Crimson Pro', 'serif'],
      },
      backgroundImage: {
        'paper': "url('/assets/paper-texture.webp')",
        'ink-splatter': "url('/assets/ink-splatter.webp')",
        'hero-vignette': "url('/assets/hero-vignette.webp')",
      },
      keyframes: {
        'ink-bleed': {
          '0%': { filter: 'blur(0px)', opacity: '0.4' },
          '50%': { filter: 'blur(2px)', opacity: '0.6' },
          '100%': { filter: 'blur(0px)', opacity: '0.4' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'typewriter': {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        'ink-bleed': 'ink-bleed 4s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'typewriter': 'typewriter 3s steps(40) forwards',
      },
    },
  },
  plugins: [],
}