import { defineConfig } from 'taze'

export default defineConfig({
  recursive: true,
  exclude: [
    'rxjs',
    'electron',
    'msw',
    'eslint', // eslint 8.40.0 is buggy
  ],
  packageMode: {
    vue: 'minor',
  },
})
