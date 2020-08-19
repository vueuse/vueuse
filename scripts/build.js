const exec = require('child_process').execSync
const path = require('path')
const assert = require('assert')
const fs = require('fs-extra')
const consola = require('consola')
const packages = require('./packages')
const { updateImport } = require('./import')

const rootDir = path.resolve(__dirname, '..')
const packageJSONDir = path.join(rootDir, 'package.json')

const metaFiles = [
  'LICENSE',
]

assert(process.cwd() !== __dirname)

async function buildMetaFiles(packageVersion) {
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
      types: 'index.d.ts',
      module: 'index.esm.js',
      unpkg: 'index.umd.min.js',
      jsdelivr: 'index.umd.min.js',
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
      dependencies: {
        'vue-demi': 'latest',
      },
    }

    await fs.writeFile(path.join(packageDist, 'package.json'), `${JSON.stringify(packageJSON, null, 2)}\n`)
  }
}

async function build() {
  await updateImport()

  const rawPackageJSON = await fs.readFile(packageJSONDir)
  const packageJSON = JSON.parse(rawPackageJSON)
  const packageVersion = packageJSON.version

  consola.info('Clean up')
  exec('yarn run clean', { stdio: 'inherit' })

  consola.info('Generate Imports')
  exec('yarn run import:generate', { stdio: 'inherit' })

  consola.info('Rollup')
  exec('rollup -c', { stdio: 'inherit' })

  consola.info('Fix types')
  exec('yarn run types:fix', { stdio: 'inherit' })

  await buildMetaFiles(packageVersion)
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

module.exports = {
  build,
}

if (require.main === module)
  cli()
