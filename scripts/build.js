const exec = require('child_process').execSync
const path = require('path')
const assert = require('assert')
const fs = require('fs-extra')
const consola = require('consola')
const { switchApi, backupApi, restoreApi } = require('./switch')
const { selectVersion } = require('./selectVersion')
const packages = require('./packages')

const rootDir = path.resolve(__dirname, '..')
const packageJSONDir = path.join(rootDir, 'package.json')

const metaFiles = [
  'LICENSE',
]

assert(process.cwd() !== __dirname)

async function buildMetaFiles(targetVersion, packageVersion) {
  for (const [pkg, options] of packages) {
    const packageDist = path.resolve(__dirname, '..', 'dist', pkg)
    const packageSrc = path.resolve(__dirname, '..', 'packages', pkg)

    for (const metaFile of metaFiles)
      await fs.copyFile(path.join(rootDir, metaFile), path.join(packageDist, metaFile))

    if (pkg === 'core')
      await fs.copyFile(path.join(rootDir, 'README.md'), path.join(packageDist, 'README.md'))
    else
      await fs.copyFile(path.join(packageSrc, 'README.md'), path.join(packageDist, 'README.md'))

    const packageJSON = {
      name: `@vueuse/${pkg}`,
      description: 'Collection of essential Vue Composition API',
      version: packageVersion,
      main: 'index.cjs.js',
      typings: 'index.d.ts',
      module: 'index.esm.js',
      unpkg: 'index.umd.min.js',
      browser: 'index.esm.js',
      repository: {
        type: 'git',
        url: 'git+https://github.com/antfu/vueuse.git',
      },
      keywords: [
        'vue',
        'vue-use',
        'utils',
        ...(options.keywords || []),
      ],
      author: 'Anthony Fu<https://github.com/antfu>',
      license: 'MIT',
      bugs: {
        url: 'https://github.com/antfu/vueuse/issues',
      },
      homepage: 'https://github.com/antfu/vueuse#readme',
    }

    if (targetVersion === 2) {
      packageJSON.peerDependencies = {
        vue: '^2.6.0',
        '@vue/composition-api': '>=0.5.0',
        ...(options.peerDependencies || {}),
      }
    }

    if (targetVersion === 3) {
      packageJSON.peerDependencies = {
        vue: 'next',
        ...(options.peerDependencies || {}),
      }
    }

    await fs.writeFile(path.join(packageDist, 'package.json'), `${JSON.stringify(packageJSON, null, 2)}\n`)
  }
}

async function buildFor(targetVersion, publishCallback) {
  assert([2, 3].includes(targetVersion))
  consola.log('')
  consola.info(`Build for Vue ${targetVersion}.x`)

  let err
  const rawPackageJSON = await fs.readFile(packageJSONDir)
  const packageJSON = JSON.parse(rawPackageJSON)
  const packageVersion = [targetVersion, ...packageJSON.version.split('.').slice(1)].join('.')

  consola.info(packageVersion)

  await fs.writeFile(packageJSONDir, JSON.stringify(packageJSON, null, 2))
  await backupApi()
  await switchApi(targetVersion, packageVersion)

  try {
    consola.info('Clean up')
    exec('npm run clean', { stdio: 'inherit' })

    consola.info('Generate Declarations')
    exec('tsc --emitDeclarationOnly', { stdio: 'inherit' })

    consola.info('Rollup')
    exec('rollup -c', { stdio: 'inherit' })

    consola.success(`Build for Vue ${targetVersion}.x finished`)

    await buildMetaFiles(targetVersion, packageVersion)

    if (publishCallback)
      await publishCallback(targetVersion, packageVersion)
  }
  catch (e) {
    err = e
  }
  finally {
    // restore packageJSON
    await fs.writeFile(packageJSONDir, rawPackageJSON)
    await restoreApi()
  }
  if (err)
    throw err
}

async function buildAll() {
  await buildFor(2)
  await buildFor(3)
}

async function cli() {
  try {
    const version = await selectVersion()
    if (version)
      await buildFor(version)
    else if (version === 0)
      await buildAll()
  }
  catch (e) {
    console.error(e)
    process.exit(1)
  }
}

module.exports = {
  buildFor,
}

if (require.main === module)
  cli()
