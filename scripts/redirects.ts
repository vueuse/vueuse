import fs from 'fs-extra'
import { functions } from '../packages/metadata/metadata'

async function buildRedirects() {
  const redirects = functions
    .filter(f => f.docs && !f.internal && !f.deprecated)
    .flatMap(f => ([f.name, ...f.alias || []]).map(n => `/${n}\t${f.docs}\t302`))
    .join('\n')

  await fs.writeFile('packages/.vitepress/dist/_redirects', redirects, 'utf-8')
}

buildRedirects()
