import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

/**
 * AURA Design Token System
 * -----------------------------------------------------------------
 * One source of truth shared by the customer storefront and the
 * admin console. Customer uses the editorial end of the scale; the
 * admin console applies a denser rhythm (see `.admin-console` in
 * globals.css) using the *same* color / type / radius / shadow
 * tokens — not a second palette.
 *
 * Colour strategy
 * -----------------------------------------------------------------
 * - Neutrals + cream surfaces are CSS variables (RGB triplets) so
 *   light/dark themes swap automatically via `.dark` on <html>.
 * - One brand accent — deep pine `#1e3932` — drives CTAs, active
 *   states, links, sale prices. `gold` is a warm heritage support.
 * - `night` (#0F0E0D) is a static near-black for the footer,
 *   announcement bar and inverse surfaces that must not invert.
 */

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ---- Neutral ink scale (inverts for dark mode) ------------
        neutral: {
          50: 'rgb(var(--n50) / <alpha-value>)',
          100: 'rgb(var(--n100) / <alpha-value>)',
          200: 'rgb(var(--n200) / <alpha-value>)',
          300: 'rgb(var(--n300) / <alpha-value>)',
          400: 'rgb(var(--n400) / <alpha-value>)',
          500: 'rgb(var(--n500) / <alpha-value>)',
          600: 'rgb(var(--n600) / <alpha-value>)',
          700: 'rgb(var(--n700) / <alpha-value>)',
          800: 'rgb(var(--n800) / <alpha-value>)',
          900: 'rgb(var(--n900) / <alpha-value>)',
          950: 'rgb(var(--n950) / <alpha-value>)',
        },

        // ---- Warm ivory cream scale (inverts for dark mode) --------
        cream: {
          50: 'rgb(var(--c50) / <alpha-value>)',
          100: 'rgb(var(--c100) / <alpha-value>)',
          200: 'rgb(var(--c200) / <alpha-value>)',
          300: 'rgb(var(--c300) / <alpha-value>)',
          400: 'rgb(var(--c400) / <alpha-value>)',
          500: 'rgb(var(--c500) / <alpha-value>)',
        },

        // ---- Brand accent: deep pine (AURA signature) --------------
        brandEmerald: {
          50: '#f2f7f5',
          100: '#e1ede8',
          200: '#c3dbd2',
          300: '#9bc1b4',
          400: '#6ea292',
          500: '#4d8575',
          600: '#3a6b5d',
          700: '#2f554b',
          800: '#28463e',
          900: '#1e3932',
          950: '#11221e',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
          ink: 'rgb(var(--accent-ink) / <alpha-value>)',
        },

        // ---- Warm heritage support tone ----------------------------
        gold: {
          50: '#FBF7F4',
          100: '#F5ECE5',
          200: '#E9D6C7',
          300: '#D5B7A0',
          400: '#B58E72',
          500: '#977257',
          600: '#846147',
          700: '#6D4E37',
          800: '#563C29',
        },

        // ---- Semantic surfaces --------------------------------------
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        sunken: 'rgb(var(--sunken) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        faint: 'rgb(var(--faint) / <alpha-value>)',

        // ---- Static inverse surface (footer, announcement bar) ------
        night: '#0F0E0D',

        // ---- Status (desaturated warm pastels — muted, non-neon) ----
        status: {
          ok: {
            bg: '#EDF3EC',
            text: '#346538',
            border: 'rgba(52, 101, 56, 0.22)',
          },
          warn: {
            bg: '#FBF3DB',
            text: '#956400',
            border: 'rgba(149, 100, 0, 0.24)',
          },
          danger: {
            bg: '#FDEBEC',
            text: '#9F2F2D',
            border: 'rgba(159, 47, 45, 0.22)',
          },
          info: {
            bg: '#E1F3FE',
            text: '#1F6C9F',
            border: 'rgba(31, 108, 159, 0.24)',
          },
        },
      },

      fontFamily: {
        heading: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Instrument Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },

      fontSize: {
        // ---- Editorial display scale (customer) ---------------------
        'display-2xl': ['clamp(3.6rem, 8vw, 6.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-xl': ['clamp(3.2rem, 7vw, 5.5rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.4rem, 5vw, 3.8rem)', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.8rem, 3.5vw, 2.75rem)', { lineHeight: '1.18', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(1.4rem, 2.5vw, 2rem)', { lineHeight: '1.25', letterSpacing: '0' }],
        'display-xs': ['clamp(1.15rem, 1.8vw, 1.4rem)', { lineHeight: '1.3', letterSpacing: '0' }],
        'heading-lg': ['1.65rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'heading-md': ['1.3rem', { lineHeight: '1.35', letterSpacing: '0' }],
        'heading-sm': ['1.1rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'heading-xs': ['0.95rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'body-lg': ['1.1rem', { lineHeight: '1.7' }],
        body: ['0.95rem', { lineHeight: '1.65' }],
        'body-sm': ['0.85rem', { lineHeight: '1.6' }],
        'body-xs': ['0.78rem', { lineHeight: '1.5' }],
        caption: ['0.72rem', { lineHeight: '1.5', letterSpacing: '0.08em' }],
        overline: ['0.68rem', { lineHeight: '1.5', letterSpacing: '0.18em' }],

        // ---- Dense admin scale (table + form + meta) ----------------
        'table': ['0.875rem', { lineHeight: '1.45' }],
        'table-sm': ['0.8125rem', { lineHeight: '1.45' }],
        'meta': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        'meta-xs': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.04em' }],
      },

      spacing: {
        4.5: '1.125rem',
        13: '3.25rem',
        17: '4.25rem',
        18: '4.5rem',
        22: '5.5rem',
      },

      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1600px',
      },

      maxWidth: {
        'container-2xl': '1380px',
        'container-wide': '1680px',
        prose: '65ch',
      },

      borderRadius: {
        none: '0',
        sm: '3px',
        DEFAULT: '5px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },

      boxShadow: {
        // Hairline-adjacent, ultra-diffuse near-zero opacity shadows
        hairline: '0 0 0 1px rgba(17,16,14,0.04)',
        subtle: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 4px 12px -2px rgb(0 0 0 / 0.05)',
        medium: '0 2px 6px -1px rgb(0 0 0 / 0.04), 0 12px 24px -4px rgb(0 0 0 / 0.06)',
        strong: '0 4px 12px -2px rgb(0 0 0 / 0.08), 0 20px 40px -8px rgb(0 0 0 / 0.12)',
        'accent-soft': '0 8px 30px -8px rgba(30, 57, 50, 0.25)',
      },

      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        gentle: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },

      transitionDuration: {
        fast: '150ms',
        250: '250ms',
        DEFAULT: '250ms',
        normal: '250ms',
        slower: '700ms',
      },

      zIndex: {
        sticky: '30',
        header: '50',
        drawer: '50',
        overlay: '100',
        lightbox: '100',
        toast: '120',
      },

      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-up': 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.25s ease-out',
        'slide-in-left': 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        marquee: 'marquee 22s linear infinite',
        'hero-zoom': 'heroZoom 8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },

      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        heroZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.06)' },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;