const exec = require('child_process').execSync
const assert = require('assert')
const path = require('path')
const fs = require('fs-extra')
const consola = require('consola')
const { buildFor } = require('./build')
const { selectVersion } = require('./selectVersion')

const rootDir = path.resolve(__dirname, '..')
const packageJSONDir = path.join(rootDir, 'package.json')

async function publishFor (targetVueVersion) {
  assert([2, 3].includes(targetVueVersion))

  await buildFor(targetVueVersion, async () => {
    consola.info(`Publish for Vue ${targetVueVersion}.x`)

    const package = JSON.parse(await fs.readFileSync(packageJSONDir, 'utf-8'))
    const { name, version } = package

    if (targetVueVersion === 3) {
      exec('npm publish --access public --tag next', { stdio: 'inherit' })
      exec(`npm dist-tag add ${name}@${version} vue3`, { stdio: 'inherit' })
    }

    if (targetVueVersion === 2) {
      exec('npm publish --access public', { stdio: 'inherit' })
      exec(`npm dist-tag add ${name}@${version} vue2`, { stdio: 'inherit' })
    }

    consola.success(`Publish for Vue ${targetVueVersion}.x finished`)
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
