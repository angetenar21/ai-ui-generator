/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Background layers (Light/Dark Theme)
        bg: {
          page: '#ffffffff',   // light gray / dark gray
          card: '#FFFFFF',   // white / dark card
          sub: '#F9FAFB',    // very light gray / darker sub
          elevated: '#FAFAFA', // slightly off-white / elevated dark
        },

        // Primary Accent (Warm Analytical)
        accent: {
          from: '#F59E0B',   // warm amber
          to: '#EA580C',     // deep orange
          solid: '#F97316',  // orange-600
        },

        // Semantic colors
        success: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',  // ✅ fixed typo
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
          primary: '#111827',   // dark gray / light text
          secondary: '#374151', // medium gray / muted light
          muted: '#6B7280',     // light gray / darker muted
          disabled: '#9CA3AF',  // very light gray / disabled dark
        },

        // Borders & dividers
        border: {
          subtle: '#E5E7EB',
          default: 'rgba(209, 213, 219, 0.9)',
          strong: '#D1D5DB',
        },

        // Data visualization palette (no hard blues)
        chart: {
          primary: '#F97316',   // orange
          secondary: '#10B981', // green
          tertiary: '#EC4899',  // pink
          quaternary: '#8B5CF6',// purple
          accent1: '#F59E0B',   // amber
          accent2: '#22C55E',   // jade
          accent3: '#A855F7',   // violet
          neutral: '#6B7280',   // gray
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
