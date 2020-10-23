import path from 'path'
import assert from 'assert'
import fs from 'fs-extra'
import consola from 'consola'
import { activePackages } from './packages'
import { execSync as exec } from 'child_process'

const rootDir = path.resolve(__dirname, '..')

const metaFiles = [
  'LICENSE',
]

assert(process.cwd() !== __dirname)

async function buildMetaFiles() {
  for (const { name } of activePackages) {
    const packageDist = path.resolve(__dirname, '..', 'packages', name)

    for (const metaFile of metaFiles)
      await fs.copyFile(path.join(rootDir, metaFile), path.join(packageDist, metaFile))

    if (name === 'core')
      await fs.copyFile(path.join(rootDir, 'README.md'), path.join(packageDist, 'README.md'))
  }
}

async function build() {
  consola.info('Clean up')
  exec('yarn run clean', { stdio: 'inherit' })

  consola.info('Generate Imports')
  exec('yarn run prepare', { stdio: 'inherit' })

  consola.info('Rollup')
  exec('npx rollup -c', { stdio: 'inherit' })

  consola.info('Fix types')
  exec('npm run types:fix', { stdio: 'inherit' })

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
