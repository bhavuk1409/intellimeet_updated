import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        dark: {
          1: '#000000', // iOS dark mode background
          2: '#121212', // Secondary dark
          3: '#1C1C1E', // iOS dark mode card
          4: '#2C2C2E', // iOS dark mode secondary
        },
        blue: {
          1: '#007AFF', // iOS blue
          2: '#5AC8FA', // iOS light blue
        },
        sky: {
          1: '#C9DDFF',
          2: '#ECF0FF',
          3: '#F5FCFF',
        },
        orange: {
          1: '#FF9500', // iOS orange
        },
        purple: {
          1: '#AF52DE', // iOS purple
        },
        red: {
          1: '#FF3B30', // iOS red
        },
        yellow: {
          1: '#FFCC00', // iOS yellow
        },
        green: {
          1: '#34C759', // iOS green
        },
        pink: {
          1: '#FF2D55', // iOS pink
        },
        gray: {
          1: '#8E8E93', // iOS gray
          2: '#AEAEB2', // iOS light gray
          3: '#C7C7CC', // iOS lighter gray
        },
      },
      borderRadius: {
        'ios': '13px',
        'ios-lg': '22px', 
        'ios-xl': '38px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'ios-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'ios-bounce': 'ios-bounce 1s ease-in-out infinite',
      },
      backgroundImage: {
        hero: "url('/images/hero-background.png')",
        'ios-gradient': 'linear-gradient(to right, #FF9500, #FF3B30)',
        'ios-blue-gradient': 'linear-gradient(to right, #007AFF, #5AC8FA)',
        'ios-purple-gradient': 'linear-gradient(to right, #AF52DE, #5E5CE6)',
        'ios-gray-gradient': 'linear-gradient(to bottom, rgba(28,28,30,0.9), rgba(28,28,30,0.4))',
        'ios-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      },
      boxShadow: {
        'ios': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'ios-inner': 'inset 0 2px 10px rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
