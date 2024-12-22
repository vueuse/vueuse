import assert from 'node:assert'
import { execSync as exec } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { consola } from 'consola'
import fs from 'fs-extra'
import { glob } from 'tinyglobby'
import YAML from 'yaml'
import { packages } from '../meta/packages'
import { version } from '../package.json'
import { metadata } from '../packages/metadata/metadata'
import { updateImport } from './utils'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const watch = process.argv.includes('--watch')

const FILES_COPY_ROOT = [
  'LICENSE',
]

const FILES_COPY_LOCAL = [
  'README.md',
  'index.json',
  '*.cjs',
  '*.mjs',
  '*.d.ts',
  '*.d.cts',
  '*.d.mts',
]

assert(process.cwd() !== __dirname)

async function buildMetaFiles() {
  const workspaceData = YAML.parse(await fs.readFile(path.resolve(rootDir, 'pnpm-workspace.yaml'), 'utf-8'))

  for (const { name } of packages) {
    const packageRoot = path.resolve(rootDir, 'packages', name)
    const packageDist = path.resolve(packageRoot, 'dist')

    if (name === 'core')
      await fs.copyFile(path.join(rootDir, 'README.md'), path.join(packageDist, 'README.md'))

    for (const file of FILES_COPY_ROOT)
      await fs.copyFile(path.join(rootDir, file), path.join(packageDist, file))

    const files = await glob(FILES_COPY_LOCAL, { cwd: packageRoot })
    for (const file of files)
      await fs.copyFile(path.join(packageRoot, file), path.join(packageDist, file))

    const packageJSON = await fs.readJSON(path.join(packageRoot, 'package.json'))
    for (const [key, value] of Object.entries(packageJSON.dependencies || {})) {
      if (key.startsWith('@vueuse/')) {
        packageJSON.dependencies[key] = version
      }
      else if ((value as string).startsWith('catalog:')) {
        const resolved = workspaceData.catalog[key as string]
        if (!resolved)
          throw new Error(`Cannot resolve catalog entry for ${key}`)
        packageJSON.dependencies[key] = resolved
      }
    }
    delete packageJSON.devDependencies
    await fs.writeJSON(path.join(packageDist, 'package.json'), packageJSON, { spaces: 2 })
  }
}

async function build() {
  consola.info('Clean up')
  exec('pnpm run clean', { stdio: 'inherit' })

  consola.info('Generate Imports')
  await updateImport(metadata)

  consola.info('Rollup')
  exec(`pnpm run build:rollup${watch ? ' -- --watch' : ''}`, { stdio: 'inherit' })

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
