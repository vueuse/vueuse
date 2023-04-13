import { version } from '../package.json'

export const currentVersion = `v${version}`

export const versions = [
  { version: currentVersion },
  { version: 'v9.8.1', link: 'https://v9-8-1.vueuse.org/' },
  { version: 'v8.9.4', link: 'https://v8-9-4.vueuse.org/' },
  { version: 'v7.7.1', link: 'https://v7-7-1.vueuse.org/' },
  { version: 'v6.7.6', link: 'https://v6-7-6.vueuse.org/' },
  { version: 'v5.3.0', link: 'https://v5-3-0.vueuse.org/' },
  { version: 'v4.11.2', link: 'https://v4-11-2.vueuse.org/' },
]
