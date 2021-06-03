import path from 'path'
import assert from 'assert'
import fs from 'fs-extra'
import consola from 'consola'
import { execSync as exec } from 'child_process'
import { updateImport } from './utils'
import { activePackages } from '../meta/packages'
import indexes from '../meta/function-indexes'

const rootDir = path.resolve(__dirname, '..')

const FILES_COPY_ROOT = [
  'LICENSE',
]

const FILES_COPY_LOCAL = [
  'package.json',
  'README.md',
]

assert(process.cwd() !== __dirname)

async function buildMetaFiles() {
  for (const { name } of activePackages) {
    const packageRoot = path.resolve(__dirname, '..', 'packages', name)
    const packageDist = path.resolve(packageRoot, 'dist')

    if (name === 'core') {
      await fs.copyFile(path.join(rootDir, 'README.md'), path.join(packageDist, 'README.md'))
      await fs.copyFile(path.join(rootDir, 'indexes.json'), path.join(packageDist, 'indexes.json'))
    }

    for (const file of FILES_COPY_ROOT)
      await fs.copyFile(path.join(rootDir, file), path.join(packageDist, file))
    for (const file of FILES_COPY_LOCAL) {
      if (fs.existsSync(path.join(packageRoot, file)))
        await fs.copyFile(path.join(packageRoot, file), path.join(packageDist, file))
    }
  }
}

async function build() {
  consola.info('Clean up')
  exec('yarn run clean', { stdio: 'inherit' })

  consola.info('Generate Imports')
  await updateImport(indexes)

  consola.info('Rollup')
  exec('yarn run build:rollup', { stdio: 'inherit' })

  consola.info('Fix types')
  exec('yarn run types:fix', { stdio: 'inherit' })

  await buildMetaFiles()
}

async function cli() {
  try {
    await build()
  }
  catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export {
  build,
}

if (require.main === module)
  cli()
