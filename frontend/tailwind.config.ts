import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B1120', // deep space navy
        foreground: '#F8FAFC',
        card: {
          DEFAULT: '#111827',
          hover: '#1F2937',
          border: '#1E293B',
        },
        meteo: {
          radar: {
            low: '#22C55E',      // light rain / green
            moderate: '#EAB308', // moderate / yellow
            high: '#F97316',     // heavy / orange
            severe: '#EF4444',   // severe / red
            extreme: '#A855F7',  // extreme / purple
          },
          lightning: '#FDE047',
          glow: '#38BDF8',
          dark: '#030712',
          surface: '#0F172A',
        },
        risk: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
          extreme: '#8B5CF6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'sweep 4s linear infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
