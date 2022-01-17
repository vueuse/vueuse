import type { Plugin } from 'vite'
import { getFunctionContributors } from '../../scripts/changelog'

const ID = '/virtual-contributors'

export function Contributors(): Plugin {
  return {
    name: 'vueuse-contributors',
    resolveId(id) {
      return id === ID ? ID : null
    },
    async load(id) {
      if (id !== ID) return null
      return `export default ${JSON.stringify(await getFunctionContributors())}`
    },
  }
}
