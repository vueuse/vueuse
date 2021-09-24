import path from 'path'
import assert from 'assert'
import { execSync as exec } from 'child_process'
import fs from 'fs-extra'
import consola from 'consola'
import { activePackages } from '../meta/packages'
import indexes from '../meta/function-indexes'
import type { PackageManifest } from '../meta/types'
import { prepareFilePath, updateImport } from './utils'

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
  async function buildPackageMetaFiles({ name, packages }: PackageManifest, parent?: string) {
    const { moduleName, submoduleName } = prepareFilePath(name, parent)
    const packageRoot = path.resolve(__dirname, '..', 'packages', moduleName)
    const packageSrc = path.resolve(packageRoot, submoduleName)
    const packageDist = path.resolve(packageRoot, 'dist', submoduleName)

    if (name === 'core') {
      await fs.copyFile(path.join(rootDir, 'README.md'), path.join(packageDist, 'README.md'))
      await fs.copyFile(path.join(rootDir, 'indexes.json'), path.join(packageDist, 'indexes.json'))
    }

    for (const file of FILES_COPY_ROOT)
      await fs.copyFile(path.join(rootDir, file), path.join(packageDist, file))
    for (const file of FILES_COPY_LOCAL) {
      if (fs.existsSync(path.join(packageSrc, file)))
        await fs.copyFile(path.join(packageSrc, file), path.join(packageDist, file))
    }

    if (Array.isArray(packages)) {
      await Promise.all(
        packages.filter(Boolean).map(i => buildPackageMetaFiles(i, name)),
      )
    }
  }

  for (const pkg of activePackages) await buildPackageMetaFiles(pkg)
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
