/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background layers (Light/Dark Theme)
        bg: {
          page: 'var(--theme-bg-page)',
          card: 'var(--theme-bg-card)',
          sub: 'var(--theme-bg-sub)',
          elevated: 'var(--theme-bg-elevated)',
        },

        // Primary Accent (Cool Analytical)
        accent: {
          from: '#F97316',   // orange
          to: '#EC4899',     // pink
          solid: '#F97316',  // orange-500
        },

        // Semantic colors
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
        info: {
          // teal-ish instead of blue
          DEFAULT: '#14B8A6',
          light: '#5EEAD4',
          dark: '#0F766E',
        },

        // Text hierarchy (Light/Dark)
        text: {
          primary: 'var(--theme-text-primary)',
          secondary: 'var(--theme-text-secondary)',
          muted: 'var(--theme-text-muted)',
          disabled: '#9CA3AF',  // very light gray / disabled dark
        },

        // Borders & dividers
        border: {
          subtle: 'var(--theme-border-subtle)',
          default: 'var(--theme-border-default)',
          strong: 'var(--theme-border-strong)',
        },

        // Data visualization palette
        chart: {
          primary: '#F97316',   // orange
          secondary: '#EC4899', // pink
          tertiary: '#8B5CF6',  // purple
          quaternary: '#10B981',// emerald
          accent1: '#F97316',   // orange
          accent2: '#FB923C',   // orange-400
          accent3: '#F472B6',   // pink-400
          neutral: '#78716C',   // stone-500
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      borderRadius: {
        card: '18px',
        btn: '12px',
        pill: '999px',
      },

      boxShadow: {
        card: '0 16px 40px rgba(0, 0, 0, 0.05)',
        prompt: '0 18px 45px rgba(0, 0, 0, 0.12)',
        hover: '0 20px 50px rgba(0, 0, 0, 0.08)',
      },

      maxWidth: {
        page: '72rem', // 1152px
      },

      backdropBlur: {
        glass: '12px',
      },

      animation: {
        gradient: 'gradient 15s ease infinite',
        twinkle: 'twinkle 8s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.35s ease',
        'bounce-dot': 'bounce 0.9s infinite',
      },

      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': '0% 50%',
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': '100% 50%',
          },
        },
        twinkle: {
          to: {
            opacity: '0.9',
            filter: 'hue-rotate(15deg)',
          },
        },
        slideUp: {
          from: {
            transform: 'translateY(6px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        bounce: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  safelist: [
    'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5', 'grid-cols-6',
    'md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4', 'md:grid-cols-5', 'md:grid-cols-6',
  ],
};
