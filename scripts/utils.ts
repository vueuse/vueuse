import { join, relative, resolve } from 'path'
import fs from 'fs-extra'
import matter from 'gray-matter'
import fg from 'fast-glob'
import parser from 'prettier/parser-typescript'
import prettier from 'prettier'
import YAML from 'js-yaml'
import Git from 'simple-git'
import { ecosystemFunctions } from '../meta/ecosystem-functions'
import { packages } from '../meta/packages'
import type { PackageIndexes, VueUseFunction, VueUsePackage } from '../meta/types'

const git = Git()

const DOCS_URL = 'https://vueuse.org'

const DIR_ROOT = resolve(__dirname, '..')
const DIR_SRC = resolve(__dirname, '../packages')
const DIR_TYPES = resolve(__dirname, '../types/packages')

export async function getTypeDefinition(pkg: string, name: string): Promise<string | undefined> {
  const typingFilepath = join(DIR_TYPES, `${pkg}/${name}/index.d.ts`)

  if (!fs.existsSync(typingFilepath))
    return

  let types = await fs.readFile(typingFilepath, 'utf-8')

  if (!types)
    return

  // clean up types
  types = types
    .replace(/import\(.*?\)\./g, '')
    .replace(/import[\s\S]+?from ?["'][\s\S]+?["']/g, '')
    .replace(/export {}/g, '')

  return prettier
    .format(
      types,
      {
        semi: false,
        parser: 'typescript',
        plugins: [parser],
      },
    )
    .trim()
}

export function hasDemo(pkg: string, name: string) {
  return fs.existsSync(join(DIR_SRC, pkg, name, 'demo.vue'))
}

export async function listFunctions(dir: string, ignore: string[] = []) {
  const files = await fg('*', {
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
  return files
}

export async function readIndexes() {
  const indexes: PackageIndexes = {
    packages: {},
    categories: [],
    functions: [
      ...ecosystemFunctions,
    ],
  }

  for (const info of packages) {
    const dir = join(DIR_SRC, info.name)

    const functions = await listFunctions(dir)

    const pkg: VueUsePackage = {
      ...info,
      dir: relative(DIR_ROOT, dir).replace(/\\/g, '/'),
      docs: info.addon ? `${DOCS_URL}/${info.name}/README.html` : undefined,
    }

    indexes.packages[info.name] = pkg

    await Promise.all(functions.map(async(fnName) => {
      const mdPath = join(dir, fnName, 'index.md')
      const tsPath = join(dir, fnName, 'index.ts')

      const fn: VueUseFunction = {
        name: fnName,
        package: pkg.name,
        lastUpdated: +await git.raw(['log', '-1', '--format=%at', tsPath]) * 1000,
      }

      if (fs.existsSync(join(dir, fnName, 'component.ts')))
        fn.component = true
      if (fs.existsSync(join(dir, fnName, 'directive.ts')))
        fn.directive = true

      if (!fs.existsSync(mdPath)) {
        fn.internal = true
        indexes.functions.push(fn)
        return
      }

      fn.docs = `${DOCS_URL}/${pkg.name}/${fnName}/`

      const mdRaw = await fs.readFile(mdPath, 'utf-8')

      const { content: md, data: frontmatter } = matter(mdRaw)
      const category = frontmatter.category

      let description = (md
        .replace(/\r\n/g, '\n')
        .match(/# \w+[\s\n]+(.+?)(?:, |\. |\n|\.\n)/m) || []
      )[1] || ''

      description = description.trim()
      description = description.charAt(0).toLowerCase() + description.slice(1)

      fn.category = ['core', 'shared'].includes(pkg.name) ? category : `@${pkg.display}`
      fn.description = description

      if (description.includes('DEPRECATED'))
        fn.deprecated = true

      indexes.functions.push(fn)
    }))
  }

  indexes.functions.sort((a, b) => a.name.localeCompare(b.name))
  indexes.categories = getCategories(indexes.functions)

  return indexes
}

export function getCategories(functions: VueUseFunction[]): string[] {
  return uniq(
    functions
      .filter(i => !i.internal)
      .map(i => i.category)
      .filter(Boolean),
  ).sort(
    (a, b) => (a.startsWith('@') && !b.startsWith('@'))
      ? 1
      : (b.startsWith('@') && !a.startsWith('@'))
        ? -1
        : a.localeCompare(b),
  )
}

export async function updateImport({ packages, functions }: PackageIndexes) {
  for (const { name, dir, manualImport } of Object.values(packages)) {
    if (manualImport)
      continue

    let imports: string[]
    if (name === 'components') {
      imports = functions
        .sort((a, b) => a.name.localeCompare(b.name))
        .flatMap((fn) => {
          const arr: string[] = []

          // don't include integration components
          if (fn.package === 'integrations')
            return arr

          if (fn.component)
            arr.push(`export * from '../${fn.package}/${fn.name}/component'`)
          if (fn.directive)
            arr.push(`export * from '../${fn.package}/${fn.name}/directive'`)
          return arr
        })
    }
    else {
      imports = functions
        .filter(i => i.package === name)
        .map(f => f.name)
        .sort()
        .map(name => `export * from './${name}'`)
    }

    if (name === 'core') {
      imports.push(
        'export * from \'./types\'',
        'export * from \'@vueuse/shared\'',
        'export * from \'./ssr-handlers\'',
      )
    }

    if (name === 'nuxt') {
      imports.push(
        'export * from \'@vueuse/core\'',
      )
    }

    await fs.writeFile(join(dir, 'index.ts'), `${imports.join('\n')}\n`)
  }
}

export function uniq<T extends any[]>(a: T) {
  return Array.from(new Set(a))
}

export function stringifyFunctions(functions: VueUseFunction[], title = true) {
  let list = ''

  const categories = getCategories(functions)

  for (const category of categories) {
    if (category.startsWith('_'))
      continue

    if (title)
      list += `### ${category}\n`

    const categoryFunctions = functions
      .filter(i => i.category === category)
      .sort((a, b) => a.name.localeCompare(b.name))

    for (const { name, docs, description, deprecated } of categoryFunctions) {
      if (deprecated)
        continue

      const desc = description ? ` — ${description}` : ''
      list += `  - [\`${name}\`](${docs})${desc}\n`
    }
    list += '\n'
  }
  return list
}

export function replacer(code: string, value: string, key: string, insert: 'head' | 'tail' | 'none' = 'none') {
  const START = `<!--${key}_STARTS-->`
  const END = `<!--${key}_ENDS-->`
  const regex = new RegExp(`${START}[\\s\\S]*?${END}`, 'im')

  const target = value ? `${START}\n${value}\n${END}` : `${START}${END}`

  if (!code.match(regex)) {
    if (insert === 'none')
      return code
    else if (insert === 'head')
      return `${target}\n\n${code}`
    else
      return `${code}\n\n${target}`
  }

  return code.replace(regex, target)
}

export async function updatePackageREADME({ packages, functions }: PackageIndexes) {
  for (const { name, dir } of Object.values(packages)) {
    const readmePath = join(dir, 'README.md')

    if (!fs.existsSync(readmePath))
      continue

    const functionMD = stringifyFunctions(functions.filter(i => i.package === name), false)
    let readme = await fs.readFile(readmePath, 'utf-8')
    readme = replacer(readme, functionMD, 'FUNCTIONS_LIST')

    await fs.writeFile(readmePath, `${readme.trim()}\n`, 'utf-8')
  }
}

export async function updateIndexREADME({ packages, functions }: PackageIndexes) {
  let readme = await fs.readFile('README.md', 'utf-8')

  const functionsCount = functions.filter(i => !i.internal).length

  readme = readme.replace(/img\.shields\.io\/badge\/-(.+?)%20functions/, `img.shields.io/badge/-${functionsCount}%20functions`)

  await fs.writeFile('README.md', `${readme.trim()}\n`, 'utf-8')
}

export async function updateFunctionsMD({ packages, functions }: PackageIndexes) {
  let mdAddons = await fs.readFile('packages/add-ons.md', 'utf-8')

  const addons = Object.values(packages)
    .filter(i => i.addon && !i.deprecated)
    .map(({ docs, name, display, description }) => {
      return `## ${display} - [\`@vueuse/${name}\`](${docs})\n${description}\n${
        stringifyFunctions(functions.filter(i => i.package === name), false)}`
    })
    .join('\n')

  mdAddons = replacer(mdAddons, addons, 'ADDONS_LIST')

  await fs.writeFile('packages/add-ons.md', mdAddons, 'utf-8')
}

export async function updateFunctionREADME(indexes: PackageIndexes) {
  const hasTypes = fs.existsSync(DIR_TYPES)

  if (!hasTypes)
    console.warn('No types dist found, run `npm run build:types` first.')

  for (const fn of indexes.functions) {
    const mdPath = `packages/${fn.package}/${fn.name}/index.md`
    if (!fs.existsSync(mdPath))
      continue

    let readme = await fs.readFile(mdPath, 'utf-8')

    const { content, data = {} } = matter(readme)

    data.category = fn.category || 'Unknown'

    readme = `---\n${YAML.dump(data)}---\n\n${content.trim()}`

    await fs.writeFile(mdPath, `${readme.trim()}\n`, 'utf-8')
  }
}

export async function updatePackageJSON(indexes: PackageIndexes) {
  const { version } = await fs.readJSON('package.json')

  for (const { name, description, author, submodules, iife } of packages) {
    const packageDir = join(DIR_SRC, name)
    const packageJSONPath = join(packageDir, 'package.json')
    const packageJSON = await fs.readJSON(packageJSONPath)

    packageJSON.version = version
    packageJSON.description = description || packageJSON.description
    packageJSON.author = author || 'Anthony Fu <https://github.com/antfu>'
    packageJSON.bugs = {
      url: 'https://github.com/vueuse/vueuse/issues',
    }
    packageJSON.homepage = name === 'core'
      ? 'https://github.com/vueuse/vueuse#readme'
      : `https://github.com/vueuse/vueuse/tree/main/packages/${name}#readme`
    packageJSON.repository = {
      type: 'git',
      url: 'git+https://github.com/vueuse/vueuse.git',
      directory: `packages/${name}`,
    }
    packageJSON.main = './index.cjs'
    packageJSON.types = './index.d.ts'
    packageJSON.module = './index.mjs'
    if (iife !== false) {
      packageJSON.unpkg = './index.iife.min.js'
      packageJSON.jsdelivr = './index.iife.min.js'
    }
    packageJSON.exports = {
      '.': {
        import: './index.mjs',
        require: './index.cjs',
        types: './index.d.ts',
      },
      './*': './*',
      ...packageJSON.exports,
    }

    if (submodules) {
      indexes.functions
        .filter(i => i.package === name)
        .forEach((i) => {
          packageJSON.exports[`./${i.name}`] = {
            import: `./${i.name}.mjs`,
            require: `./${i.name}.cjs`,
            types: `./${i.name}.d.ts`,
          }
          if (i.component) {
            packageJSON.exports[`./${i.name}/component`] = {
              import: `./${i.name}/component.mjs`,
              require: `./${i.name}/component.cjs`,
              types: `./${i.name}/component.d.ts`,
            }
          }
        })
    }

    await fs.writeJSON(packageJSONPath, packageJSON, { spaces: 2 })
  }
}
