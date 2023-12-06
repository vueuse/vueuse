import { defineConfig } from 'taze'

export default defineConfig({
  recursive: true,
  exclude: [
    'rxjs',
    'electron',
    'msw',
    'vue2',
    // TODO: migrate
    'vitepress',
  ],
  packageMode: {
    vue: 'minor',
  },
})
