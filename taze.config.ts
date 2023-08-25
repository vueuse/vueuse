import { defineConfig } from 'taze'

export default defineConfig({
  recursive: true,
  exclude: [
    'rxjs',
    'electron',
    'msw',
    'vue2',
  ],
  packageMode: {
    vue: 'minor',
  },
})
