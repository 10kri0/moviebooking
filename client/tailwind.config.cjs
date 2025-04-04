/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

/**
 * Generates grid column templates dynamically.
 */
function generateGridColumns(lastValue) {
  return Object.fromEntries(
    Array.from({ length: lastValue + 1 }, (_, i) => [`${i}`, `repeat(${i}, minmax(160px, 1fr))`])
  );
}

/**
 * Generates grid row templates dynamically.
 */
function generateGridRow(lastValue) {
  return Object.fromEntries(
    Array.from({ length: lastValue + 1 }, (_, i) => [`${i}`, `max-content repeat(${i}, minmax(5px, 1fr))`])
  );
}

/**
 * Generates row and column start values dynamically.
 */
function generateRowColStart(lastValue) {
  return Object.fromEntries(
    Array.from({ length: lastValue - 7 }, (_, i) => [`${i + 8}`, `${i + 8}`])
  );
}

/**
 * Generates row span values dynamically.
 */
function generateRowSpan(lastValue) {
  return Object.fromEntries(
    Array.from({ length: lastValue - 6 }, (_, i) => [`span-${i + 7}`, `span ${i + 7} / span ${i + 7}`])
  );
}


module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-tailwindcss-select/dist/index.esm.js'
  ],
  safelist: [
    { pattern: /grid-rows-.*/ },
    { pattern: /grid-cols-.*/ },
    { pattern: /row-start-.*/ },
    { pattern: /col-start-.*/ },
    { pattern: /row-span-.*/ } // Fixed regex pattern
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans Thai', ...defaultTheme.fontFamily.sans]
      },
      gridTemplateRows: generateGridRow(400),
      gridTemplateColumns: generateGridColumns(100),
      gridRowStart: generateRowColStart(300),
      gridColumnStart: generateRowColStart(300),
      gridRow: generateRowSpan(300)
    }
  },
  plugins: []
}


module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-tailwindcss-select/dist/index.esm.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans Thai', ...defaultTheme.fontFamily.sans]
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'tilt': 'tilt 10s infinite linear',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
      },
      backgroundImage: {
        'cinematic-gradient': 'linear-gradient(to bottom right, #1a1a2e, #16213e, #0f3460)',
        'red-gradient': 'linear-gradient(to right, #ff416c, #ff4b2b)'
      },
      colors: {
        'cinematic-black': '#0a0a0a',
        'cinematic-red': '#ff416c',
        'cinematic-dark-blue': '#1a1a2e',
        'neon-red': '#ff4b2b',
        'dark-maroon': '#2a0a0a'
      },
      boxShadow: {
        'cinematic': '0 0 30px -5px rgba(255, 65, 108, 0.3)',
        'neon-red': '0 4px 15px rgba(255, 75, 43, 0.5)'
      }
    }
  },
  plugins: [],
  safelist: [
    'animate-fade-in',
    'animate-slide-up',
    'animate-tilt',
    'bg-cinematic-dark-blue',
    'bg-cinematic-red',
    'text-neon-red'
  ]
}