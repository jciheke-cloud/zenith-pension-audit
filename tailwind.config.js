/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        dark: {
          900: '#0b101b',
          800: '#121a29',
          700: '#1e2941',
          600: '#29354a',
        },
        brand: {
          red:    '#C81E1E',
          redHov: '#A91D22',
          alert:  '#DC2626',
          emerald:'#10B981',
          amber:  '#F59E0B',
        },
      },
      animation: {
        'fade-in':   'fadeIn 0.5s ease-out',
        'slide-up':  'slideUp 0.4s ease-out',
        'glow-pulse':'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(200,30,30,0.2)' },
          '50%':      { boxShadow: '0 0 20px rgba(200,30,30,0.45)' },
        },
      },
    },
  },
  plugins: [],
}
