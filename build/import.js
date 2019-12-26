const path = require('path')
const fs = require('fs-extra')
const { version } = require('../package.json')

const srcDir = path.resolve(__dirname, '../src')

async function updateImport () {
  const files = fs
    .readdirSync(srcDir)
    .filter(f => f.startsWith('use'))
    .sort()

  let content = ''
  content += `export const version = '${version}'\n\n`
  content += files.map(f => `export * from './${f}'\n`).join('')

  fs.writeFileSync(path.join(srcDir, 'index.ts'), content)
}

if (require.main === module)
  updateImport()
