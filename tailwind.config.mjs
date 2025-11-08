// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // ▼▼▼ `src` フォルダの中を監視するように設定します ▼▼▼
    './src/pages/**/*.{js,ts,tsx,mdx}',
    './src/components/**/*.{js,ts,tsx,mdx}',
    './src/app/**/*.{js,ts,tsx,mdx}', // ★ 特にこの行が重要です
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;