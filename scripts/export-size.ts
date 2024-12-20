import * as fs from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getExportsSize } from 'export-size'
import { filesize } from 'filesize'
import jsonfile from 'jsonfile'
import { markdownTable } from 'markdown-table'
import { packages } from '../meta/packages'
import { version } from '../package.json'

const { writeFile: writeJSON } = jsonfile
const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function run() {
  // made shared library imported can resolve correctly
  const packagesRoot = resolve(__dirname, '..', 'packages')
  await fs.writeFile(join(packagesRoot, 'shared/index.mjs'), 'export * from "./dist/index.mjs"', 'utf-8')
  await fs.writeFile(join(packagesRoot, 'core/index.mjs'), 'export * from "./dist/index.mjs"', 'utf-8')
  await fs.cp(join(packagesRoot, 'shared/dist'), join(packagesRoot, 'core/dist/node_modules/@vueuse/shared'), { force: true, recursive: true })

  let md = '# Export size\n\n'
  const mdJSON = <{ [name: string]: string }>{}
  md += 'generated by [export-size](https://github.com/antfu/export-size)<br>\n'
  md += `version: ${version}<br>\n`
  md += `date: ${new Date().toISOString()}\n\n`

  md += '> Please note this is bundle size for each individual APIs (excluding Vue). '
  md += 'Since we have a lot shared utilities underneath each function, importing two '
  md += 'different functions does NOT necessarily mean the bundle size will be the sum of them (usually smaller). '
  md += 'Depends on the bundler and minifier you use, the final result might vary, this list is for reference only.'
  md += '\n\n'

  for (const pkg of [...packages.slice(2), packages[1]]) {
    const { exports, packageJSON } = await getExportsSize({
      pkg: `./packages/${pkg.name}/dist`,
      output: false,
      bundler: 'rollup',
      external: ['vue', ...(pkg.external || [])],
      includes: ['@vueuse/shared'],
    })

    md += `<kbd>${packageJSON.name}</kbd>\n\n`

    md += markdownTable([
      ['Function', 'min+gzipped'],
      ...exports.map((i) => {
        mdJSON[i.name] = filesize(i.minzipped)
        return [`\`${i.name}\``, filesize(i.minzipped)]
      }),
    ])

    md += '\n\n'
  }

  md = md.replace(/\r\n/g, '\n')

  await fs.rm(join(packagesRoot, 'shared/index.mjs'), { force: true })
  await fs.rm(join(packagesRoot, 'core/index.mjs'), { force: true })
  await fs.writeFile('packages/export-size.md', md, 'utf-8')
  await writeJSON('packages/export-size.json', mdJSON, { spaces: 2 })
}

run()
