module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'cursor-trail': 'cursorTrail 1.5s ease-out forwards',
        'fade-scale': 'fadeScale 0.8s ease-out forwards',
        'slide-up-in': 'slideUpIn 0.8s ease-out forwards',
        'slide-up-out': 'slideUpOut 0.8s ease-out forwards',
        'slide-down-in': 'slideDownIn 0.8s ease-out forwards',
        'slide-down-out': 'slideDownOut 0.8s ease-out forwards',
        'slide-left-in': 'slideLeftIn 0.8s ease-out forwards',
        'slide-left-out': 'slideLeftOut 0.8s ease-out forwards',
        'slide-right-in': 'slideRightIn 0.8s ease-out forwards',
        'slide-right-out': 'slideRightOut 0.8s ease-out forwards',
        'flip-out': 'flipOut 0.3s ease-out forwards',
        'flip-in': 'flipIn 0.3s ease-out forwards',
        'flip-hidden': 'flipHidden 0.3s ease-out forwards',
        'card-active': 'cardActive 0.6s ease-out forwards',
        'card-next': 'cardNext 0.6s ease-out forwards',
        'card-prev': 'cardPrev 0.6s ease-out forwards',
        'scroll-text': 'scrollText linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
        cursorTrail: {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.5) rotate(-10deg)' 
          },
          '20%': { 
            opacity: '1', 
            transform: 'scale(1) rotate(0deg)' 
          },
          '100%': { 
            opacity: '0', 
            transform: 'scale(0.3) rotate(20deg)' 
          },
        },
        fadeScale: {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.8)' 
          },
          '50%': { 
            opacity: '1', 
            transform: 'scale(1.05)' 
          },
          '100%': { 
            opacity: '0.8', 
            transform: 'scale(1)' 
          },
        },
        slideUpIn: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(50px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        slideUpOut: {
          '0%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
          '100%': { 
            opacity: '0', 
            transform: 'translateY(50px)' 
          },
        },
        slideDownIn: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(-50px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        slideDownOut: {
          '0%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
          '100%': { 
            opacity: '0', 
            transform: 'translateY(-50px)' 
          },
        },
        slideLeftIn: {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(50px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
        },
        slideLeftOut: {
          '0%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
          '100%': { 
            opacity: '0', 
            transform: 'translateX(50px)' 
          },
        },
        slideRightIn: {
          '0%': { 
            opacity: '0', 
            transform: 'translateX(-50px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
        },
        slideRightOut: {
          '0%': { 
            opacity: '1', 
            transform: 'translateX(0)' 
          },
          '100%': { 
            opacity: '0', 
            transform: 'translateX(-50px)' 
          },
        },
        flipOut: {
          '0%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
          '100%': { 
            opacity: '0', 
            transform: 'translateY(-20px)' 
          },
        },
        flipIn: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        flipHidden: {
          '0%, 100%': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
        },
        cardActive: {
          '0%': { 
            transform: 'scale(0.9) rotateY(15deg)', 
            opacity: '0.8' 
          },
          '100%': { 
            transform: 'scale(1) rotateY(0deg)', 
            opacity: '1' 
          },
        },
        cardNext: {
          '0%': { 
            transform: 'scale(1) rotateY(0deg)', 
            opacity: '1' 
          },
          '100%': { 
            transform: 'scale(0.9) rotateY(15deg)', 
            opacity: '0.8' 
          },
        },
        cardPrev: {
          '0%': { 
            transform: 'scale(1) rotateY(0deg)', 
            opacity: '1' 
          },
          '100%': { 
            transform: 'scale(0.9) rotateY(-15deg)', 
            opacity: '0.8' 
          },
        },
        scrollText: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};