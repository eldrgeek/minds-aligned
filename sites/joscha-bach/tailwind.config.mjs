/** @type {import('tailwindcss').Config} */
import baseConfig from '../../packages/config/tailwind.config.js'

export default {
  ...baseConfig,
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
}
