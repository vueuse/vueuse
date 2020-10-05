const path = require('path')
const fs = require('fs-extra')
const packages = require('./packages')

const srcDir = path.resolve(__dirname, '../packages')

async function updateImport() {
  for (const [pkg] of packages) {
    const pkdDir = path.join(srcDir, pkg)

    const files = fs
      .readdirSync(pkdDir, { withFileTypes: true })
      .filter(f => !f.name.startsWith('_') && f.isDirectory())
      .map(f => f.name)
      .sort()

    let content = ''
    content += files.map(f => `export * from './${f}'\n`).join('')

    fs.writeFileSync(path.join(pkdDir, 'index.ts'), content)
  }
}

module.exports = { updateImport }

if (require.main === module)
  updateImport()
