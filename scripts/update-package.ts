import path from 'path'
import fs from 'fs-extra'
import consola from 'consola'
import { activePackages } from './packages'

const rootDir = path.resolve(__dirname, '..')
const srcDir = path.resolve(rootDir, 'packages')

export async function updatePackageJSON() {
  const { version } = await fs.readJSON(path.join(rootDir, 'package.json'))

  for (const { name, description, author } of activePackages) {
    const packageDir = path.join(srcDir, name)
    const packageJSONPath = path.join(packageDir, 'package.json')
    const packageJSON = await fs.readJSON(packageJSONPath)

    packageJSON.version = version
    packageJSON.description = description
    packageJSON.author = author || 'Anthony Fu<https://github.com/antfu>'
    packageJSON.bugs = {
      url: 'https://github.com/antfu/vueuse/issues',
    }
    packageJSON.homepage = name === 'core'
      ? 'https://github.com/antfu/vueuse#readme'
      : `https://github.com/antfu/vueuse/tree/master/packages/${name}#readme`

    for (const key of Object.keys(packageJSON.dependencies)) {
      if (key.startsWith('@vueuse/'))
        packageJSON.dependencies[key] = version
    }

    await fs.writeJSON(packageJSONPath, packageJSON, { spaces: 2 })

    consola.success(`package.json for "${name}" updated`)
  }
}

if (require.main === module)
  updatePackageJSON()
