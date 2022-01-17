import type { Plugin } from 'vite'
import { getChangeLog } from '../../scripts/changelog'

const ID = '/virtual-changelog'

export function ChangeLog(): Plugin {
  return {
    name: 'vueuse-changelog',
    resolveId(id) {
      return id === ID ? ID : null
    },
    async load(id) {
      if (id !== ID) return null
      return `export default ${JSON.stringify(await getChangeLog(400))}`
    },
  }
}
