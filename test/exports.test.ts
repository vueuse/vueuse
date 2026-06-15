import { resolve } from 'node:path'
import { checkBuildState } from 'tsdown-stale-guard'
import { describePackagesApiSnapshots } from 'tsnapi/vitest'

const root = resolve(import.meta.dirname, '..')

describePackagesApiSnapshots({
  cwd: root,
  beforeEach: async (ctx) => {
    const result = await checkBuildState({ root: ctx.packageRoot })
    if (!result.fresh) {
      throw new Error('Build is not fresh, run `pnpm build` to fix it')
    }
  },
})
