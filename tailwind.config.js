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

        // ─── OpenUI Design Tokens (oklch) ───
        oui: {
          bg: 'var(--oui-bg)',
          fg: 'var(--oui-fg)',
          popover: 'var(--oui-popover)',
          sunk: 'var(--oui-sunk)',
          'sunk-deep': 'var(--oui-sunk-deep)',
          elevated: 'var(--oui-elevated)',
          'elevated-strong': 'var(--oui-elevated-strong)',
          overlay: 'var(--oui-overlay)',
          'inverted-bg': 'var(--oui-inverted-bg)',
          'info-bg': 'var(--oui-info-bg)',
          'success-bg': 'var(--oui-success-bg)',
          'alert-bg': 'var(--oui-alert-bg)',
          'danger-bg': 'var(--oui-danger-bg)',
          'purple-bg': 'var(--oui-purple-bg)',
          'pink-bg': 'var(--oui-pink-bg)',
          'text-primary': 'var(--oui-text-primary)',
          'text-secondary': 'var(--oui-text-secondary)',
          'text-tertiary': 'var(--oui-text-tertiary)',
          'text-link': 'var(--oui-text-link)',
          'text-success': 'var(--oui-text-success)',
          'text-alert': 'var(--oui-text-alert)',
          'text-danger': 'var(--oui-text-danger)',
          'text-info': 'var(--oui-text-info)',
          'text-pink': 'var(--oui-text-pink)',
          'text-purple': 'var(--oui-text-purple)',
          'interactive': 'var(--oui-interactive-default)',
          'interactive-hover': 'var(--oui-interactive-hover)',
          'interactive-disabled': 'var(--oui-interactive-disabled)',
          'border': 'var(--oui-border)',
          'border-interactive': 'var(--oui-border-interactive)',
          'border-emphasis': 'var(--oui-border-emphasis)',
          'border-selected': 'var(--oui-border-selected)',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        'oui-body': ['var(--oui-font-body)'],
        'oui-heading': ['var(--oui-font-heading)'],
        'oui-code': ['var(--oui-font-code)'],
      },

      borderRadius: {
        card: '18px',
        btn: '12px',
        pill: '999px',
        // OpenUI radius tokens
        'oui-xs': 'var(--oui-radius-xs)',
        'oui-s': 'var(--oui-radius-s)',
        'oui-m': 'var(--oui-radius-m)',
        'oui-l': 'var(--oui-radius-l)',
        'oui-xl': 'var(--oui-radius-xl)',
        'oui-2xl': 'var(--oui-radius-2xl)',
        'oui-3xl': 'var(--oui-radius-3xl)',
        'oui-4xl': 'var(--oui-radius-4xl)',
        'oui-full': 'var(--oui-radius-full)',
      },

      boxShadow: {
        card: '0 16px 40px rgba(0, 0, 0, 0.05)',
        prompt: '0 18px 45px rgba(0, 0, 0, 0.12)',
        hover: '0 20px 50px rgba(0, 0, 0, 0.08)',
        // OpenUI shadow tokens
        'oui-s': 'var(--oui-shadow-s)',
        'oui-m': 'var(--oui-shadow-m)',
        'oui-l': 'var(--oui-shadow-l)',
        'oui-xl': 'var(--oui-shadow-xl)',
        'oui-2xl': 'var(--oui-shadow-2xl)',
      },

      spacing: {
        // OpenUI spacing tokens
        'oui-3xs': 'var(--oui-space-3xs)',
        'oui-2xs': 'var(--oui-space-2xs)',
        'oui-xs': 'var(--oui-space-xs)',
        'oui-s': 'var(--oui-space-s)',
        'oui-m': 'var(--oui-space-m)',
        'oui-l': 'var(--oui-space-l)',
        'oui-xl': 'var(--oui-space-xl)',
        'oui-2xl': 'var(--oui-space-2xl)',
        'oui-3xl': 'var(--oui-space-3xl)',
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
