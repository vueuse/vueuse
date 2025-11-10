import { x } from 'tinyexec'
import { describe, expect, it } from 'vitest'
import { getPackageExportsManifest } from 'vitest-package-exports'
import yaml from 'yaml'

describe('exports-snapshot', async () => {
  const packages: { name: string, path: string, private?: boolean }[] = JSON.parse(
    await x('pnpm', ['ls', '--only-projects', '-r', '--json']).then(r => r.stdout),
  )

  for (const pkg of packages) {
    if (pkg.private)
      continue

    it(`${pkg.name}`, async () => {
      const manifest = await getPackageExportsManifest({
        importMode: 'dist',
        cwd: pkg.path,
      })
      await expect(yaml.stringify(manifest.exports, { sortMapEntries: (a, b) => String(a.key).localeCompare(String(b.key)) }))
        .toMatchFileSnapshot(`./exports/${pkg.name.split('/').pop()}.yaml`)
    })
  }
})
