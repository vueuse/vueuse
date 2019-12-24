/* eslint-disable @typescript-eslint/no-var-requires */

const exec = require('child_process').execSync
const assert = require('assert')
const { buildFor } = require('./build')
const { selectVersion } = require('./selectVersion')

async function publishFor (targetVersion) {
  assert([2, 3].includes(targetVersion))

  await buildFor(targetVersion)

  if (targetVersion === 3)
    exec('npm publish --access public --tag next')

  if (targetVersion === 3)
    exec('npm publish --access public')
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
    else
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
