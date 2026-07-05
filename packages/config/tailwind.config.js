// Shared Tailwind configuration for all Society of Minds Aligned sites
// Import this in each subsite's tailwind.config.mjs

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F141F',
          deep: '#03122B',
          card: '#151B2B',
        },
        cream: '#F5F1EB',
        body: '#E9EAED',
        muted: '#9BA3B5',
        accent: {
          DEFAULT: '#3C6CDD',
          deep: '#143D9F',
          hover: '#4D7AE8',
        },
        border: 'rgba(255,255,255,0.10)',
        'border-light': 'rgba(15,20,31,0.12)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        'hero': 'clamp(2.5rem, 6vw, 4rem)',
      },
      letterSpacing: {
        eyebrow: '0.2em',
        label: '0.15em',
      },
    },
  },
  plugins: [],
}
