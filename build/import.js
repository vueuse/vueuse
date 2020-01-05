const path = require('path')
const fs = require('fs-extra')

const srcDir = path.resolve(__dirname, '../packages/core')
const packageFilepath = path.resolve(__dirname, '../package.json')

async function getVersion () {
  const raw = await fs.readFile(packageFilepath)
  return JSON.parse(raw).version
}

async function updateImport () {
  const files = fs
    .readdirSync(srcDir)
    .filter(f => f.startsWith('use'))
    .sort()

  let content = ''
  content += `export const version = '${await getVersion()}'\n\n`
  content += files.map(f => `export * from './${f}'\n`).join('')

  fs.writeFileSync(path.join(srcDir, 'index.ts'), content)
}

module.exports = { updateImport }

if (require.main === module)
  updateImport()
