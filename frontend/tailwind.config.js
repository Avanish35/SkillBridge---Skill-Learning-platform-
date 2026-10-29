/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- Premium Midnight Palette ---
        midnight: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#05050f', // Near black for ultra contrast
        },
        // --- Cosmic Luminous Accents ---
        primary: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // Violet
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        secondary: {
          400: '#22d3ee',
          500: '#06b6d4', // Vibrant Cyan
          600: '#0891b2',
        },
        accent: {
          400: '#e879f9',
          500: '#d946ef', // Fuchsia
          600: '#c026d3',
        },
        success: {
          400: '#34d399',
          500: '#10b981', // Emerald
        },
        warning: {
          400: '#fbbf24',
          500: '#f59e0b', // Amber
        },
        error: {
          400: '#fb7185',
          500: '#f43f5e', // Rose
        },
        // --- Legacy compatibility ---
        brand: {
          50:  'var(--color-brand-50, #f5f3ff)',
          100: 'var(--color-brand-100, #ede9fe)',
          500: 'var(--color-brand-500, #8b5cf6)',
          600: 'var(--color-brand-600, #7c3aed)',
          700: 'var(--color-brand-700, #6d28d9)',
          900: 'var(--color-brand-900, #4c1d95)',
        },
        gray: {
          // Using CSS variables already defined in global.css
          50:  'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03))',
        'hero-mesh': 'radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.2) 0, transparent 50%), radial-gradient(at 50% 0%, rgba(6, 182, 212, 0.15) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(217, 70, 239, 0.15) 0, transparent 50%)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 5s ease infinite',
        'fade-in-blur': 'fade-in-blur 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.7, transform: 'scale(1)', 'box-shadow': '0 0 15px rgba(139, 92, 246, 0.4)' },
          '50%': { opacity: 1, transform: 'scale(1.05)', 'box-shadow': '0 0 30px rgba(139, 92, 246, 0.6)' },
        },
        'gradient-x': {
          '0%, 100%': {
              'background-size': '200% 200%',
              'background-position': 'left center'
          },
          '50%': {
              'background-size': '200% 200%',
              'background-position': 'right center'
          },
        },
        'fade-in-blur': {
          '0%': { opacity: 0, filter: 'blur(10px)', transform: 'translateY(10px)' },
          '100%': { opacity: 1, filter: 'blur(0)', transform: 'translateY(0)' },
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2.5rem',
      },
      backdropBlur: {
        xs: '2px',
      }
    }
  },
  plugins: [],
};