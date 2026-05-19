/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FAFAF7',
        ink: '#0A0A0A',
        emerald: {
          DEFAULT: '#0F766E',
          dark: '#0B5A54',
          light: '#14B8A6',
        },
        muted: '#6B7280',
        loss: '#DC2626',
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
    },
  },
  plugins: [],
};
