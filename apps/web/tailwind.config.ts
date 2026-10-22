import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: colors.blue[900],
          hover: colors.blue[950],
          ring: colors.blue[700],
          muted: colors.blue[50],
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
