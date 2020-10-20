import path from 'path'
import fs from 'fs-extra'
import { packages } from './packages'
import { listFunctions } from './utils'

const srcDir = path.resolve(__dirname, '../packages')

async function updateImport() {
  for (const [pkg, options] of packages as any) {
    if (options.autoImport === false)
      continue

    const pkgDir = path.join(srcDir, pkg)

    const files = await listFunctions(pkgDir)

    let content = files.map(f => `export * from './${f}'\n`).join('')

    if (pkg === 'core')
      content += '\nexport * from \'@vueuse/shared\''

    await fs.writeFile(path.join(pkgDir, 'index.ts'), content)
  }
}

export { updateImport }

if (require.main === module)
  updateImport()
