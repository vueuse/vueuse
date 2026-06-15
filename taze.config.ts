import { defineConfig } from 'taze'

export default defineConfig({
  recursive: true,
  exclude: [
    'rxjs',
    'electron',
  ],
  packageMode: {
    vue: 'minor',
  },
})
