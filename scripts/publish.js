const exec = require('child_process').execSync
const assert = require('assert')
const path = require('path')
const consola = require('consola')
const { buildFor } = require('./build')
const packages = require('./packages')
const { selectVersion } = require('./selectVersion')

const distDir = path.resolve(__dirname, '..', 'dist')

async function publishFor (targetVueVersion) {
  assert([2, 3].includes(targetVueVersion))

  await buildFor(targetVueVersion, async (targetVersion, packageVersion) => {
    consola.info(`Publish for Vue ${targetVueVersion}.x`)

    for (const [pkg] of packages) {
      const packageDist = path.join(distDir, pkg)

      if (targetVueVersion === 3) {
        exec('npm publish --access public --tag next', { stdio: 'inherit', cwd: packageDist })
        exec(`npm dist-tag add @vueuse/${pkg}@${packageVersion} vue3`, { stdio: 'inherit', cwd: packageDist })
      }

      if (targetVueVersion === 2) {
        exec('npm publish --access public', { stdio: 'inherit', cwd: packageDist })
        exec(`npm dist-tag add @vueuse/${pkg}@${packageVersion} vue2`, { stdio: 'inherit', cwd: packageDist })
      }

      consola.success(`Published @vueuse/${pkg} for Vue ${targetVueVersion}.x`)
    }
  })
}

async function publishAll () {
  await publishFor(2)
  await publishFor(3)
}

async function cli () {
  try {
    const version = await selectVersion()
    if (version)
      await publishFor(version)
    else if (version === 0)
      await publishAll()
  }
  catch (e) {
    console.error(e)
  }
}

module.exports = {
  publishFor,
}

if (require.main === module)
  cli()
