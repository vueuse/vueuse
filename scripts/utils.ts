import { join, relative, resolve } from 'path'
import fs from 'fs-extra'
import matter from 'gray-matter'
import fg from 'fast-glob'
import parser from 'prettier/parser-typescript'
import prettier from 'prettier'
import YAML from 'js-yaml'
import { activePackages, allPackages, packages } from '../meta/packages'
import { PackageIndexes, PackageManifest, VueUseFunction, VueUsePackage } from '../meta/types'

const DOCS_URL = 'https://vueuse.org'
const GITHUB_BLOB_URL = 'https://github.com/vueuse/vueuse/blob/main/packages'

const DIR_ROOT = resolve(__dirname, '..')
const DIR_SRC = resolve(__dirname, '../packages')
const DIR_TYPES = resolve(__dirname, '../types/packages')

export function isFilledArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && !!value.length
}

export function isFilledString(value: unknown): value is string {
  return typeof value === 'string' && !!value.length
}

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

export function getFunctionHead(pkg: string, name: string) {
  let head = allPackages.find(p => p.name === pkg)!.addon
    ? `available in add-on [\`@vueuse/${pkg}\`](/${pkg}/README)`
    : ''

  if (head)
    head = `\n::: tip\n${head}\n:::\n`

  return head
}

export async function getFunctionFooter(pkg: string, name: string) {
  const URL = `${GITHUB_BLOB_URL}/${pkg}/${name}`

  const hasDemo = fs.existsSync(join(DIR_SRC, pkg, name, 'demo.vue'))

  const types = await getTypeDefinition(pkg, name)

  const typingSection = types && `## Type Declarations\n\n\`\`\`typescript\n${types.trim()}\n\`\`\``

  const links = ([
    ['Source', `${URL}/index.ts`],
    hasDemo ? ['Demo', `${URL}/demo.vue`] : undefined,
    ['Docs', `${URL}/index.md`],
  ])
    .filter(i => i)
    .map(i => `[${i![0]}](${i![1]})`).join(' • ')

  const sourceSection = `## Source\n\n${links}\n`

  return `${typingSection || ''}\n\n${sourceSection}\n`
}

export function getSubmoduleNames(packages: PackageManifest['packages']) {
  return (packages || [])
    .map(i => i.name.split('/').pop())
    .filter(isFilledString)
}

interface GetFilenameFn {
  (name: string): string
  moduleName: string
  submoduleName: string
}
export function prepareFilePath(name: string, parent: string) {
  const moduleName = parent || name
  const submoduleName = parent ? relative(parent, name) : ''

  const fn = (fileName: string) => join('packages', moduleName, 'dist', submoduleName, fileName)
  Object.assign(fn, { moduleName, submoduleName })

  return fn as GetFilenameFn
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

async function readPackage(info: PackageManifest, dir: string) {
  const packages = await Promise.all(
    (info.packages || []).map(i => readPackage(i, join(DIR_SRC, i.name))),
  )

  const pkg: VueUsePackage = {
    ...info,
    packages,
    dir: relative(DIR_ROOT, dir).replace(/\\/g, '/'),
    docs: info.addon ? `${DOCS_URL}/${info.name}/README.html` : undefined,
  }

  return pkg
}

async function readFunction(pkg: VueUsePackage, src: string, fnName: string) {
  const fn: VueUseFunction = {
    name: fnName,
    package: pkg.name,
  }

  if (fs.existsSync(join(src, fnName, 'component.ts')))
    fn.component = true
  if (fs.existsSync(join(src, fnName, 'directive.ts')))
    fn.directive = true

  const mdPath = join(src, fnName, 'index.md')
  if (!fs.existsSync(mdPath)) {
    fn.internal = true
    return fn
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
    fn.depreacted = true

  return fn
}

async function readFunctions(pkg: VueUsePackage, src: string) {
  const ignore = getSubmoduleNames(pkg.packages)

  const functions = await listFunctions(src, ignore)

  return Promise.all(functions.map(fnName => readFunction(pkg, src, fnName)))
}

export async function readIndexes() {
  const indexes: PackageIndexes = {
    packages: {},
    categories: [],
    functions: [],
  }

  async function getPackage(info: PackageManifest) {
    const src = join(DIR_SRC, info.name)
    const pkg = await readPackage(info, src)

    if (isFilledArray(pkg.packages)) {
      pkg.packages.forEach(async(i) => {
        const { pkg, src } = await getPackage(i)
        const fns = await readFunctions(pkg, src)
        indexes.functions.push(...fns)
      })
    }

    return {
      src,
      pkg,
    }
  }

  for (const info of packages) {
    const { pkg, src } = await getPackage(info)
    const fns = await readFunctions(pkg, src)

    indexes.packages[info.name] = pkg
    indexes.functions.push(...fns)
  }

  indexes.categories = getCategories(indexes.functions)

  return indexes
}

export function getCategories(functions: VueUseFunction[]): string[] {
  return uniq(
    functions
      .filter(i => !i.internal)
      .map(i => i.category)
      .filter(Boolean),
  ).sort()
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
          const arr = []
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

    const categoryFunctions = functions.filter(i => i.category === category).sort((a, b) => a.name.localeCompare(b.name))

    for (const { name, docs, description, depreacted } of categoryFunctions) {
      if (depreacted)
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
  async function update({ name, dir, packages }: VueUsePackage) {
    const readmePath = join(dir, 'README.md')

    if (!fs.existsSync(readmePath))
      return

    const functionMD = stringifyFunctions(functions.filter(i => i.package === name), false)
    let readme = await fs.readFile(readmePath, 'utf-8')
    readme = replacer(readme, functionMD, 'FUNCTIONS_LIST')

    await fs.writeFile(readmePath, `${readme.trim()}\n`, 'utf-8')

    if (isFilledArray(packages))
      await Promise.all(packages.map(update))
  }

  await Promise.all(Object.values(packages).map(update))
}

export async function updateIndexREADME({ packages, functions }: PackageIndexes) {
  let readme = await fs.readFile('README.md', 'utf-8')

  const functionsCount = functions.filter(i => !i.internal).length

  readme = readme.replace(/img\.shields\.io\/badge\/-(.+?)%20functions/, `img.shields.io/badge/-${functionsCount}%20functions`)

  await fs.writeFile('README.md', `${readme.trim()}\n`, 'utf-8')
}

export async function updateFunctionsMD({ packages, functions }: PackageIndexes) {
  let mdFn = await fs.readFile('packages/functions.md', 'utf-8')

  const coreFunctions = functions.filter(i => ['core', 'shared'].includes(i.package))
  const functionListMD = stringifyFunctions(coreFunctions)

  mdFn = replacer(mdFn, functionListMD, 'FUNCTIONS_LIST')
  await fs.writeFile('packages/functions.md', mdFn, 'utf-8')

  let mdAddons = await fs.readFile('packages/add-ons.md', 'utf-8')

  function generateAddons(packages: VueUsePackage[], level = '##'): string {
    return packages
      .filter(i => i.addon && !i.deprecated)
      .map(({ docs, name, display, description, packages }) => {
        return `${level} ${display} - [\`@vueuse/${name}\`](${docs})\n${description}\n${
          stringifyFunctions(functions.filter(i => i.package === name), false)}${
          isFilledArray(packages) ? generateAddons(packages, `${level}#`) : ''}`
      })
      .join('\n')
  }

  const addons = generateAddons(Object.values(packages))

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

  async function update(pkg: PackageManifest) {
    const { name, description, author, submodules, iife, packages } = pkg
    const packageDir = join(DIR_SRC, name)
    const packageJSONPath = join(packageDir, 'package.json')
    const packageJSON = await fs.readJSON(packageJSONPath)

    packageJSON.version = version
    packageJSON.description = description || packageJSON.description
    packageJSON.author = author || 'Anthony Fu<https://github.com/antfu>'
    packageJSON.bugs = {
      url: 'https://github.com/vueuse/vueuse/issues',
    }
    packageJSON.homepage = name === 'core'
      ? 'https://github.com/vueuse/vueuse#readme'
      : `https://github.com/vueuse/vueuse/tree/main/packages/${name}#readme`
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
      },
      './*': './*',
    }

    if (submodules) {
      indexes.functions
        .filter(i => i.package === name)
        .forEach((i) => {
          packageJSON.exports[`./${i.name}`] = {
            import: `./${i.name}.mjs`,
            require: `./${i.name}.cjs`,
          }
        })
    }

    for (const key of Object.keys(packageJSON.dependencies)) {
      if (key.startsWith('@vueuse/'))
        packageJSON.dependencies[key] = version
    }

    await fs.writeJSON(packageJSONPath, packageJSON, { spaces: 2 })

    if (isFilledArray(packages))
      await Promise.all(packages.map(update))
  }

  await Promise.all(activePackages.map(update))
}
