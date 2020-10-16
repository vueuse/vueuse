import fg from 'fast-glob'
import fs from 'fs-extra'

async function FixTypingOutput() {
  const files = await fg('./{types,dist}/**/*.d.ts', {
    onlyFiles: true,
  })

  for (const f of files) {
    const raw = await fs.readFile(f, 'utf-8')
    const changed = raw.replace(/@vue\/composition-api/g, 'vue-demi')
    await fs.writeFile(f, changed, 'utf-8')
  }
}

FixTypingOutput()
