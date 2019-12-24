/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs-extra')

const srcDir = path.resolve(__dirname, '../src')

async function backupApi () {
  await fs.copyFile(
    path.join(srcDir, 'api.ts'),
    path.join(srcDir, 'api.backup.ts'),
  )
}

async function restoreApi () {
  await fs.copyFile(
    path.join(srcDir, 'api.backup.ts'),
    path.join(srcDir, 'api.ts'),
  )
  await fs.remove(
    path.join(srcDir, 'api.backup.ts'),
  )
}

async function switchApi (version) {
  await fs.copyFile(
    path.join(srcDir, `api.${version}.ts`),
    path.join(srcDir, 'api.ts'),
  )
}

async function cli () {
  let version = 0
  if (process.argv[2])
    version = +process.argv[2].slice(0, 1)

  if (!version) {
    const inquirer = require('inquirer')
    const result = await inquirer
      .prompt([{
        name: 'switch',
        type: 'list',
        message: 'Target Vue Api Version',
        choices: ['2.x', '3.x'],
      }])

    if (result.switch)
      version = +result.switch.slice(0, 1)
  }

  if (version) {
    console.log(`Switch api to ${version}.x`)
    await switchApi(version)
  }
}

module.exports = {
  switchApi,
  backupApi,
  restoreApi,
}

if (require.main === module)
  cli()
