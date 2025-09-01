/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        background: {
          light: '#ffffff',
          soft: '#f8f9fa',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'pulse-modern': 'pulse-modern 2s infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bus-move': 'busMoveAnimation 3s infinite',
        'wheel-spin': 'wheelSpinAnimation 1s infinite linear',
        'smoke-1': 'smokeAnimation 2s infinite',
        'smoke-2': 'smokeAnimation 2s infinite 0.4s',
        'smoke-3': 'smokeAnimation 2s infinite 0.8s',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-modern': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        busMoveAnimation: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(150vw)' },
        },
        wheelSpinAnimation: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        smokeAnimation: {
          '0%': { opacity: '0', transform: 'translate(0, 0) scale(1)' },
          '25%': { opacity: '0.5', transform: 'translate(-5px, -5px) scale(1.5)' },
          '50%': { opacity: '0.3', transform: 'translate(-10px, -10px) scale(2)' },
          '75%': { opacity: '0.1', transform: 'translate(-15px, -15px) scale(2.5)' },
          '100%': { opacity: '0', transform: 'translate(-20px, -20px) scale(3)' },
        },
      },
      boxShadow: {
        'modern': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 2px 10px -3px rgba(0, 0, 0, 0.05)',
        'modern-lg': '0 20px 60px -15px rgba(0, 0, 0, 0.1), 0 4px 20px -5px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'modern': '1.5rem',
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'section-title': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'body': ['1.125rem', { lineHeight: '1.6' }],
      },
    },
  },
  plugins: [],
}


