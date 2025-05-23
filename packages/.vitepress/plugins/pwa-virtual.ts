import type { Plugin } from 'vite'

export function PWAVirtual(): Plugin {
  const name = 'virtual:pwa'
  const resolved = `\0${name}`
  const packagesPromises = import('../../metadata')
  return {
    name: 'pwa-virtual',
    enforce: 'pre',
    resolveId(id) {
      return id === name ? resolved : null
    },
    async load(id) {
      if (id === resolved) {
        const { categoryNames, metadata } = await packagesPromises
        const packages: [path: string, { url: string, hash: string }][] = []
        for (const name of categoryNames) {
          if (name[0] === '_') {
            continue
          }

          for (const f of metadata.functions) {
            if (f.external || f.category !== name || f.internal) {
              continue
            }
            const url = `/${f.package}/${f.name}/`
            packages.push([url.toLowerCase(), { url, hash: f.name }])
          }
        }

        return `export const packageNames = ${JSON.stringify(packages)};`
      }
    },
  }
}
