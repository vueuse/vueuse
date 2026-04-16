import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { globSync } from 'tinyglobby'
import { checkBuildFreshness } from 'tsdown-stale-guard'
import { describePackagesApiSnapshots } from 'tsnapi/vitest'

const root = resolve(import.meta.dirname, '..')

const packages = globSync('packages/*', { cwd: root, onlyDirectories: true })
  .map(p => resolve(root, p))
  .filter(p => existsSync(join(p, 'package.json')))
  .sort()

describePackagesApiSnapshots({
  cwd: root,
  packages,
  beforeEach: async (ctx) => {
    const result = await checkBuildFreshness({ root: ctx.packageRoot })
    if (!result.fresh) {
      throw new Error('Build is not fresh, run `pnpm build` to fix it')
    }
  },
})
