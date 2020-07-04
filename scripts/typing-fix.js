const fg = require('fast-glob')
const path = require('path')
const fs = require('fs-extra')

async function FixTypingOutput() {
  const dirname = path.resolve(__dirname, '../typings')
  const files = await fg('**/*.d.ts', {
    onlyFiles: true,
    cwd: dirname,
  })

  for (const f of files) {
    const filepath = path.join(dirname, f)
    const raw = await fs.readFile(filepath, 'utf-8')
    const changed = raw.replace(/@vue\/composition-api/g, 'vue-demi')
    await fs.writeFile(filepath, changed, 'utf-8')
  }
}

FixTypingOutput()
