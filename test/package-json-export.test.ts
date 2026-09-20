import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { x } from 'tinyexec'
import { describe, expect, it } from 'vitest'

describe('package.json export', async () => {
  const packages: { name: string, path: string, private?: boolean }[] = JSON.parse(
    await x('pnpm', ['ls', '--only-projects', '-r', '--json']).then(r => r.stdout),
  )

  for (const pkg of packages) {
    if (pkg.private)
      continue

    const pkgJson = JSON.parse(readFileSync(resolve(pkg.path, 'package.json'), 'utf-8'))
    const exports = pkgJson.exports
    if (!exports || !exports['./*'])
      continue

    it(`${pkg.name} should have explicit ./package.json export`, () => {
      expect(exports['./package.json']).toBe('./package.json')

      const resolvedPath = resolve(pkg.path, 'package.json')
      expect(existsSync(resolvedPath)).toBe(true)
    })
  }
})
