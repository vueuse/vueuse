import path from 'path'
import fs from 'fs-extra'
import { packages } from './packages'
import { listFunctions } from './utils'

const srcDir = path.resolve(__dirname, '../packages')

async function updateImport() {
  for (const { name, manualImport } of packages) {
    if (manualImport)
      continue

    const pkgDir = path.join(srcDir, name)

    const files = await listFunctions(pkgDir)

    let content = files.map(f => `export * from './${f}'\n`).join('')

    if (name === 'core')
      content += '\nexport * from \'@vueuse/shared\'\n'

    await fs.writeFile(path.join(pkgDir, 'index.ts'), content)
  }
}

export { updateImport }

if (require.main === module)
  updateImport()
