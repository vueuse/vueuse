import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { x } from 'tinyexec'
import { globSync } from 'tinyglobby'
import { checkBuildFreshness } from 'tsdown-lock'
import { describePackagesApiSnapshots } from 'tsnapi/vitest'
import { beforeAll } from 'vitest'

const root = resolve(import.meta.dirname, '..')

function resolveWorkspacePackages() {
  const dirs: string[] = []
  for (const match of globSync('packages/*', { cwd: root })) {
    const abs = resolve(root, match)
    if (existsSync(join(abs, 'package.json'))) {
      const pkg = JSON.parse(readFileSync(join(abs, 'package.json'), 'utf-8'))
      if (!pkg.private)
        dirs.push(abs)
    }
  }
  return dirs
}

beforeAll(async () => {
  const packages = resolveWorkspacePackages()
  const stale = (await Promise.all(
    packages.map(async (dir) => {
      const result = await checkBuildFreshness({ root: dir })
      return result.fresh ? null : dir
    }),
  )).filter(Boolean) as string[]

  if (stale.length) {
    const names = stale.map(dir => JSON.parse(readFileSync(join(dir, 'package.json'), 'utf-8')).name)
    const filters = names.flatMap(n => ['-F', n])
    await x('pnpm', ['run', '-r', 'build', ...filters], { nodeOptions: { cwd: root } })
  }
}, 120_000)

describePackagesApiSnapshots({ cwd: root })
