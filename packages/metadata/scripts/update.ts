import type { PackageIndexes, VueUseFunction, VueUsePackage } from '@vueuse/metadata'
import { existsSync } from 'node:fs'
import * as fs from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import Git from 'simple-git'
import { glob } from 'tinyglobby'
import { ecosystemFunctions } from '../../../meta/ecosystem-functions'
import { packages } from '../../../meta/packages'
import { getCategories } from '../utils'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export const DOCS_URL = 'https://vueuse.org'
export const DIR_PACKAGE = resolve(__dirname, '..')
export const DIR_ROOT = resolve(__dirname, '../../..')
export const DIR_SRC = resolve(DIR_ROOT, 'packages')
export const DIR_TYPES = resolve(DIR_ROOT, 'types/packages')

export const git = Git(DIR_ROOT)

export async function listFunctions(dir: string, ignore: string[] = []) {
  const files = await glob('*', {
    onlyDirectories: true,
    cwd: dir,
    ignore: [
      '_*',
      'dist',
      'node_modules',
      ...ignore,
    ],
  })
  files.sort()
  return files.map(path => path.endsWith('/') ? path.slice(0, -1) : path)
}

export async function readMetadata() {
  const indexes: PackageIndexes = {
    packages: {},
    categories: [],
    functions: [
      ...ecosystemFunctions,
    ],
  }

  for (const info of packages) {
    if (info.utils)
      continue

    const dir = join(DIR_SRC, info.name)

    const functions = await listFunctions(dir)

    const pkg: VueUsePackage = {
      ...info,
      dir: relative(DIR_ROOT, dir).replace(/\\/g, '/'),
      docs: info.addon ? `${DOCS_URL}/${info.name}/README.html` : undefined,
    }

    indexes.packages[info.name] = pkg

    await Promise.all(functions.map(async (fnName) => {
      const mdPath = join(dir, fnName, 'index.md')
      const tsPath = join(dir, fnName, 'index.ts')

      const fn: VueUseFunction = {
        name: fnName,
        package: pkg.name,
        lastUpdated: +await git.raw(['log', '-1', '--format=%at', tsPath]) * 1000,
      }

      if (existsSync(join(dir, fnName, 'component.ts')))
        fn.component = true
      if (existsSync(join(dir, fnName, 'directive.ts')))
        fn.directive = true

      if (!existsSync(mdPath)) {
        fn.internal = true
        indexes.functions.push(fn)
        return
      }

      fn.docs = `${DOCS_URL}/${pkg.name}/${fnName}/`

      const mdRaw = await fs.readFile(mdPath, 'utf-8')

      const { content: md, data: frontmatter } = matter(mdRaw)
      const category = frontmatter.category

      let alias = frontmatter.alias
      if (typeof alias === 'string')
        alias = alias.split(',').map(s => s.trim()).filter(Boolean)
      let related = frontmatter.related
      if (typeof related === 'string')
        related = related.split(',').map(s => s.trim()).filter(Boolean)
      else if (Array.isArray(related))
        related = related.map(s => s.trim()).filter(Boolean)

      let description = (
        md
          // normalize newlines
          .replace(/\r\n/g, '\n')
          // remove ::: tip blocks
          .replace(/(:{3,}(?=[^:\n]*\n))[^\n]*\n[\s\S]*?\1 *(?=\n)/g, '')
          // remove headers
          .match(/#(?=\s).*\n+(.+?)(?:, |\. |\n|\.\n)/) || []
      )[1] || ''

      description = description.trim()
      description = description.charAt(0).toLowerCase() + description.slice(1)

      fn.category = ['core', 'shared'].includes(pkg.name) ? category : `@${pkg.display}`
      fn.description = description

      if (description.includes('DEPRECATED') || frontmatter.deprecated)
        fn.deprecated = true

      if (alias?.length)
        fn.alias = alias

      if (related?.length)
        fn.related = related

      if (pkg.submodules)
        fn.importPath = `${pkg.name}/${fn.name}`

      indexes.functions.push(fn)
    }))
  }

  indexes.functions.sort((a, b) => a.name.localeCompare(b.name))
  indexes.categories = getCategories(indexes.functions)

  // interop related
  indexes.functions.forEach((fn) => {
    if (!fn.related)
      return

    fn.related.forEach((name) => {
      const target = indexes.functions.find(f => f.name === name)
      if (!target)
        throw new Error(`Unknown related function: ${name}`)
      if (!target.related)
        target.related = []
      if (!target.related.includes(fn.name))
        target.related.push(fn.name)
    })
  })
  indexes.functions.forEach(fn => fn.related?.sort())

  return indexes
}

async function run() {
  const indexes = await readMetadata()
  await fs.writeFile(join(DIR_PACKAGE, 'index.json'), `${JSON.stringify(indexes, null, 2)}\n`)
}

run()
