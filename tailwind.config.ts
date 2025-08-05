import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neon accent colors
        neon: {
          blue: '#00f5ff',
          cyan: '#00ffff',
          purple: '#bf00ff',
          pink: '#ff0080',
          green: '#00ff80',
          yellow: '#ffff00',
        },
        // Glass/backdrop colors
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          medium: 'rgba(255, 255, 255, 0.15)',
          dark: 'rgba(0, 0, 0, 0.1)',
          darker: 'rgba(0, 0, 0, 0.2)',
        },
        // Dark theme specific colors
        dark: {
          bg: '#0a0a0a',
          surface: '#1a1a1a',
          card: '#262626',
          border: '#404040',
        },
      },
      dropShadow: {
        'neon-blue': '0 0 10px #00f5ff',
        'neon-cyan': '0 0 10px #00ffff',
        'neon-purple': '0 0 10px #bf00ff',
        'neon-pink': '0 0 10px #ff0080',
        'neon-green': '0 0 10px #00ff80',
        'neon-yellow': '0 0 10px #ffff00',
        'glow-sm': '0 0 5px rgba(0, 245, 255, 0.5)',
        'glow-md': '0 0 10px rgba(0, 245, 255, 0.5)',
        'glow-lg': '0 0 20px rgba(0, 245, 255, 0.5)',
        'glow-xl': '0 0 30px rgba(0, 245, 255, 0.5)',
      },
      blur: {
        xs: '2px',
        '4xl': '72px',
        '5xl': '96px',
        '6xl': '128px',
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
        '5xl': '96px',
        '6xl': '128px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            filter: 'drop-shadow(0 0 10px currentColor)',
          },
          '50%': {
            opacity: '.8',
            filter: 'drop-shadow(0 0 20px currentColor)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow-sm': '0 0 5px rgba(0, 245, 255, 0.3)',
        'glow-md': '0 0 15px rgba(0, 245, 255, 0.4)',
        'glow-lg': '0 0 25px rgba(0, 245, 255, 0.5)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
}

export default config
