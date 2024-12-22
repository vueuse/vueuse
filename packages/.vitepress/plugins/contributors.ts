import type { ContributorInfo } from '@vueuse/metadata'
import type { Plugin } from 'vite'

const ID = '/virtual-contributors'

export function Contributors(data: Record<string, ContributorInfo[]>): Plugin {
  return {
    name: 'vueuse-contributors',
    resolveId(id) {
      return id === ID ? ID : null
    },
    load(id) {
      if (id !== ID)
        return null
      return `export default ${JSON.stringify(data)}`
    },
  }
}
