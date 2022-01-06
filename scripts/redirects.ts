import fs from 'fs-extra'
import indexes from '../meta/function-indexes'

async function buildRedirects() {
  const redirects = indexes.functions
    .filter(f => f.docs && !f.internal && !f.deprecated)
    .map(f => `/${f.name}\t${f.docs}\t302`)
    .join('\n')

  await fs.writeFile('packages/.vitepress/dist/_redirects', redirects, 'utf-8')
}

buildRedirects()
