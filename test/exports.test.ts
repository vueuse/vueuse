import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { globSync } from 'tinyglobby'
import { checkBuildFreshness } from 'tsdown-stale-guard'
import { describePackagesApiSnapshots } from 'tsnapi/vitest'

const root = resolve(import.meta.dirname, '..')

const packages = globSync('packages/*', { cwd: root, onlyDirectories: true })
  .map(p => resolve(root, p))
  .filter((p) => {
    if (!existsSync(join(p, 'package.json')))
      return false
    const pkg = JSON.parse(readFileSync(join(p, 'package.json'), 'utf-8'))
    return !pkg.private && pkg.exports
  })
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
