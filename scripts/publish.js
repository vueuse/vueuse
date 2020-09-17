const exec = require('child_process').execSync
const path = require('path')
const { build } = require('./build')
const packages = require('./packages')
const consola = require('consola')

const distDir = path.resolve(__dirname, '..', 'dist')

async function publish() {
  await build()

  for (const [pkg, { deprecated }] of packages) {
    if (deprecated)
      continue
    const packageDist = path.join(distDir, pkg)

    exec('yarn publish --access public --non-interactive', { stdio: 'inherit', cwd: packageDist })

    consola.success(`Published @vueuse/${pkg}`)
  }
}

async function cli() {
  try {
    publish()
  }
  catch (e) {
    console.error(e)
    process.exit(1)
  }
}

module.exports = {
  publish,
}

if (require.main === module)
  cli()
