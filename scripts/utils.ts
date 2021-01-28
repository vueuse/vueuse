import { resolve, join, relative } from 'path'
import fs from 'fs-extra'
import matter from 'gray-matter'
import fg from 'fast-glob'
import parser from 'prettier/parser-typescript'
import prettier from 'prettier'
import YAML from 'js-yaml'
import { activePackages, packages } from '../meta/packages'
import { PackageIndexes, VueUseFunction, VueUsePackage } from '../meta/types'

const DOCS_URL = 'https://vueuse.js.org'
const GITHUB_BLOB_URL = 'https://github.com/vueuse/vueuse/blob/main/packages'
// const VUE_REACTIVITY_USE = 'https://github.com/vue-reactivity/use'

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
  let head = packages.find(p => p.name === pkg)!.addon
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
    functions: [],
  }

  for (const info of packages) {
    const dir = join(DIR_SRC, info.name)

    const functions = await listFunctions(dir)

    const pkg: VueUsePackage = {
      ...info,
      dir: relative(DIR_ROOT, dir),
      docs: info.addon ? `${DOCS_URL}/${info.name}/README.html` : undefined,
    }

    indexes.packages[info.name] = pkg

    for (const fnName of functions) {
      const mdPath = join(dir, fnName, 'index.md')

      const fn: VueUseFunction = {
        name: fnName,
        package: pkg.name,
      }

      if (!fs.existsSync(mdPath)) {
        fn.internal = true
        indexes.functions.push(fn)
        continue
      }

      fn.docs = `${DOCS_URL}/${pkg.name}/${fnName}/`

      const mdRaw = await fs.readFile(join(dir, fnName, 'index.md'), 'utf-8')

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

      indexes.functions.push(fn)
    }
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

    let content = functions
      .filter(i => i.package === name)
      .map(f => f.name)
      .sort()
      .map(name => `export * from './${name}'`)
      .join('\n')

    if (name === 'core')
      content += '\nexport * from \'@vueuse/shared\''

    content += '\n'

    await fs.writeFile(join(dir, 'index.ts'), content)
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
  let mdFn = await fs.readFile('packages/functions.md', 'utf-8')

  const coreFunctions = functions.filter(i => ['core', 'shared'].includes(i.package))
  const functionListMD = stringifyFunctions(coreFunctions)

  mdFn = replacer(mdFn, functionListMD, 'FUNCTIONS_LIST')
  await fs.writeFile('packages/functions.md', mdFn, 'utf-8')

  let mdAddons = await fs.readFile('packages/add-ons.md', 'utf-8')

  const addons = Object.values(packages)
    .filter(i => i.addon && !i.deprecated)
    .map(({ docs, name, display, description }) => {
      return `### ${display} - [\`@vueuse/${name}\`](${docs})\n${description}\n${
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
    const demoPath = `packages/${fn.package}/${fn.name}/demo.vue`
    if (!fs.existsSync(mdPath))
      continue

    let readme = await fs.readFile(mdPath, 'utf-8')

    // readme = replacer(readme, await getFunctionHead(fn.package), 'HEAD', 'head')
    // let DEMO = ''
    // if (fs.existsSync(demoPath))
    //   DEMO = '<script setup>\nimport Demo from \'./demo.vue\'\n</script>\n<DemoContainer><Demo/></DemoContainer>'

    // readme = replacer(readme, DEMO, 'DEMO', 'head')

    if (hasTypes)
      readme = replacer(readme, await getFunctionFooter(fn.package, fn.name), 'FOOTER', 'tail')

    const { content, data = {} } = matter(readme)

    data.category = fn.category || 'Unknown'

    readme = `---\n${YAML.dump(data)}---\n\n${content.trim()}`

    await fs.writeFile(mdPath, `${readme.trim()}\n`, 'utf-8')
  }
}

export async function updatePackageJSON() {
  const { version } = await fs.readJSON('package.json')

  for (const { name, description, author } of activePackages) {
    const packageDir = join(DIR_SRC, name)
    const packageJSONPath = join(packageDir, 'package.json')
    const packageJSON = await fs.readJSON(packageJSONPath)

    packageJSON.version = version
    packageJSON.funding = 'https://github.com/sponsors/antfu'
    packageJSON.description = description || packageJSON.description
    packageJSON.author = author || 'Anthony Fu<https://github.com/antfu>'
    packageJSON.bugs = {
      url: 'https://github.com/vueuse/vueuse/issues',
    }
    packageJSON.homepage = name === 'core'
      ? 'https://github.com/vueuse/vueuse#readme'
      : `https://github.com/vueuse/vueuse/tree/main/packages/${name}#readme`
    packageJSON.main = './dist/index.cjs.js'
    packageJSON.types = './dist/index.d.ts'
    packageJSON.module = './dist/index.esm.js'
    packageJSON.unpkg = './dist/index.umd.min.js'
    packageJSON.jsdelivr = './dist/index.umd.min.js'
    packageJSON.exports = {
      '.': {
        import: './dist/index.esm.js',
        require: './dist/index.cjs.js',
      },
      './': './',
    }

    for (const key of Object.keys(packageJSON.dependencies)) {
      if (key.startsWith('@vueuse/'))
        packageJSON.dependencies[key] = version
    }

    await fs.writeJSON(packageJSONPath, packageJSON, { spaces: 2 })
  }
}
