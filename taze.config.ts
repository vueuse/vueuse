import { defineConfig } from 'taze'

export default defineConfig({
  recursive: true,
  exclude: [
    'rxjs',
    'electron',
    'msw',
  ],
  packageMode: {
    vue: 'minor',
  },
})
