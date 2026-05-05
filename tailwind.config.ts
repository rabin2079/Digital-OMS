import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: { extend: { colors: { brandPurple: '#6D28D9', brandOrange: '#F97316' } } },
  plugins: []
};
export default config;
