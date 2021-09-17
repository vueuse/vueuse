import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
  extract: {
    include: [
      '**/*.vue',
      '.vitepress/theme/**/*.vue',
    ],
  },
  attributify: true,
  theme: {
    extend: {
      colors: {
        primary: '#3eaf7c',
      },
    },
  },
})
