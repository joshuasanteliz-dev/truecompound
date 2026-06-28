/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0B0E14',
        surface: '#13161D',
        'surface-2': '#1A1E27',
        'surface-3': '#222633',
        border: {
          DEFAULT: '#252934',
          strong: '#363B47',
        },
        ink: '#F5F7FA',
        'ink-dim': '#C9CFDB',
        muted: '#8B92A5',
        'muted-2': '#5B6275',
        emerald: {
          DEFAULT: '#22C55E',
          dark: '#15803D',
          light: '#4ADE80',
        },
        gain: {
          DEFAULT: '#22C55E',
          dark: '#15803D',
          soft: 'rgba(34, 197, 94, 0.12)',
        },
        loss: {
          DEFAULT: '#EF4444',
          dark: '#B91C1C',
          soft: 'rgba(239, 68, 68, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontFeatureSettings: {
        tnum: '"tnum", "cv11"',
      },
      maxWidth: {
        '6xl': '72rem',
      },
      boxShadow: {
        'card': '0 1px 0 0 rgba(255,255,255,0.02) inset, 0 1px 2px 0 rgba(0,0,0,0.6)',
        'card-hover': '0 0 0 1px rgba(34,197,94,0.4), 0 8px 24px -8px rgba(0,0,0,0.8)',
      },
    },
  },
  plugins: [],
};
