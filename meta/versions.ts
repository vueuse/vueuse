import { version } from '../package.json'

export const currentVersion = `v${version}`

export const versions = [
  { version: currentVersion },
  { version: 'v5.3', link: 'https://v5-3-0.vueuse.org/' },
  { version: 'v4.11', link: 'https://v4-11-2.vueuse.org/' },
  { version: 'v4.0', link: 'https://v4-0-6.vueuse.org/' },
]
