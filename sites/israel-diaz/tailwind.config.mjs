/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        navy: '#0F141F',
        surface: '#161D2B',
        ink: '#E8ECF4',
        muted: '#8B95A8',
        accent: {
          DEFAULT: '#3C6CDD',
          light: '#1A2844',
          mid: '#5A84E8',
        },
        border: '#2A3347',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
