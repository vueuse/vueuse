/* eslint-disable @typescript-eslint/no-var-requires */
// const exec = require('child_process').execFileSync
const path = require('path')
const assert = require('assert')
const semver = require('semver')
const fs = require('fs-extra')
const { switchApi, backupApi, restoreApi } = require('./switch')

const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const packageJSONDir = path.join(rootDir, 'package.json')

assert(process.cwd() !== __dirname)

async function buildFor (targetVersion) {
  assert([2, 3].includes(targetVersion))

  console.log(`\nBuild for Vue ${targetVersion}.x`)

  const rawPackageJSON = await fs.readFile(packageJSONDir)
  const packageJSON = JSON.parse(rawPackageJSON)

  const rawVersion = semver.inc(packageJSON.version, 'prerelease', 'alpha')
  const version = [targetVersion, ...rawVersion.split('.').slice(1)].join('.')

  console.log(version)

  packageJSON.version = version

  delete packageJSON.devDependencies
  delete packageJSON.scripts
  delete packageJSON.husky
  delete packageJSON['lint-staged']

  if (targetVersion === 2) {
    packageJSON.peerDependencies = {
      vue: '^2.6.0',
      '@vue/composition-api': '^0.3.0',
    }
  }

  if (targetVersion === 3) {
    packageJSON.peerDependencies = {
      vue: '^3.0.0',
      '@vue/runtime-dom': '^3.0.0',
    }
  }

  await fs.remove(distDir)

  switchApi(targetVersion)

  // exec('tsc -p tsconfig.json')
  // exec('tsc -p tsconfig.module.json')
}

async function buildAll () {
  await backupApi()

  await buildFor(2)
  await buildFor(3)

  await restoreApi()
}

async function cli () {
  try {
    await buildAll()
  }
  catch (e) {
    console.error(e)
  }
}

if (require.main === module)
  cli()
