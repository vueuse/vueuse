const exec = require('child_process').execSync
const assert = require('assert')
const consola = require('consola')
const { buildFor } = require('./build')
const { selectVersion } = require('./selectVersion')

async function publishFor (targetVersion) {
  assert([2, 3].includes(targetVersion))

  await buildFor(targetVersion, async () => {
    consola.info(`Publish for Vue ${targetVersion}.x`)

    if (targetVersion === 3)
      exec('npm publish --access public --tag next', { stdio: 'inherit' })

    if (targetVersion === 2)
      exec('npm publish --access public', { stdio: 'inherit' })

    consola.success(`Publish for Vue ${targetVersion}.x finished`)
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
