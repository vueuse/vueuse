import assert from 'node:assert'
import { execSync as exec } from 'node:child_process'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { consola } from 'consola'
import YAML from 'yaml'
import { packages } from '../meta/packages'
import { version } from '../package.json'
import { metadata } from '../packages/metadata/metadata'
import { updateImport } from './utils'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const watch = process.argv.includes('--watch')

assert(process.cwd() !== __dirname)

async function buildMetaFiles() {
  const workspaceData = YAML.parse(await fs.readFile(path.resolve(rootDir, 'pnpm-workspace.yaml'), 'utf-8'))

  for (const { name } of packages) {
    const packageRoot = path.resolve(rootDir, 'packages', name)

    const packageJSON = JSON.parse(await fs.readFile(path.join(packageRoot, 'package.json'), { encoding: 'utf8' }))
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
