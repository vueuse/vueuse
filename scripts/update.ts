import path from 'path'
import { activePackages, PackageManifest, packages } from './packages'
import { listFunctions } from './utils'
import fs from 'fs-extra'

interface VueUseFunction {
  name: string
  category?: string
  description?: string
  docs?: string
  depreacted?: boolean
}

interface PackageIndex {
  info: PackageManifest
  dir: string
  docs?: string
  categories: Record<string, VueUseFunction[]>
}

type PackageIndexes = Record<string, PackageIndex>

const storybookUrl = 'https://vueuse.js.org'
const srcDir = './packages'

async function readIndexes() {
  const indexes: PackageIndexes = {}

  for (const info of packages) {
    const { name } = info
    const dir = path.join(srcDir, name)

    const functions = await listFunctions(dir)

    const index: PackageIndex = {
      info,
      dir,
      docs: info.addon ? `${storybookUrl}/?path=/story/${name.replace('/', '')}--readme` : undefined,
      categories: {},
    }

    indexes[name] = index

    const { categories } = index
    for (const fnName of functions) {
      const storyPath = path.join(dir, fnName, 'index.stories.tsx')

      if (!fs.existsSync(storyPath)) {
        if (!categories._utils)
          categories._utils = []

        categories._utils.push({
          name: fnName,
        })
        continue
      }

      const storyRaw = await fs.readFile(storyPath, 'utf-8')
      const mdRaw = await fs.readFile(path.join(dir, fnName, 'index.md'), 'utf-8')
      const match = /category: '(.+)',/gm.exec(storyRaw) || /storiesOf\('(.+)'[\s\S]+?\.add\('(.+)'/gm.exec(storyRaw)

      if (!match)
        continue

      let description = (mdRaw
        .replace(/\r\n/g, '\n')
        .match(/\n> (.+?)(?:, |\. |\n|\.\n)/) || []
      )[1] || ''

      description = description.trim()
      description = description.charAt(0).toLowerCase() + description.slice(1)

      const [, category] = match

      if (!category)
        continue

      const categoryName = category.split('|').slice(-1).join(' ')

      if (!categories[categoryName])
        categories[categoryName] = []

      categories[categoryName].push({
        name: fnName,
        category: categoryName,
        docs: `${storybookUrl}/?path=/story/${category.replace(/[|\s]/g, '-').replace('/', '')}--${fnName}`.toLowerCase(),
        description,
        depreacted: description.includes('DEPRECATED'),
      })
    }
  }

  return indexes
}

export async function updateImport(indexes: PackageIndexes) {
  for (const [name, { dir, categories, info }] of Object.entries(indexes)) {
    if (info.manualImport)
      continue

    let content = Object
      .values(categories)
      // @ts-ignore
      .flatMap(i => i)
      .map(f => f.name)
      .sort()
      .map(name => `export * from './${name}'`)
      .join('\n')

    if (name === 'core')
      content += '\nexport * from \'@vueuse/shared\''

    content += '\n'

    await fs.writeFile(path.join(dir, 'index.ts'), content)
  }
}

function stringifyCategories(categories: Record<string, VueUseFunction[]>, title = true) {
  let list = ''

  for (const category of Object.keys(categories).sort()) {
    if (category.startsWith('_'))
      continue

    if (title)
      list += `- ${category}\n`

    for (const { name, docs, description, depreacted } of categories[category].sort((a, b) => a.name.localeCompare(b.name))) {
      if (depreacted)
        continue

      const desc = description ? ` — ${description}` : ''
      list += `  - [\`${name}\`](${docs})${desc}\n`
    }
    list += '\n'
  }
  return list
}

async function updatePackageREADME(indexes: PackageIndexes) {
  for (const { dir, categories } of Object.values(indexes)) {
    const readmePath = path.join(dir, 'README.md')

    if (!fs.existsSync(readmePath))
      continue

    let readme = await fs.readFile(readmePath, 'utf-8')
    readme = readme.replace(/<!--FUNCTIONS_LIST_STARTS-->[\s\S]+?<!--FUNCTIONS_LIST_ENDS-->/m, `<!--FUNCTIONS_LIST_STARTS-->\n\n${stringifyCategories(categories)}<!--FUNCTIONS_LIST_ENDS-->`)

    await fs.writeFile(readmePath, readme, 'utf-8')
  }
}

function mergeCategories(categories: Record<string, VueUseFunction[]>[]) {
  const result: Record<string, VueUseFunction[]> = {}

  for (const category of categories) {
    for (const [key, value] of Object.entries(category)) {
      if (!result[key])
        result[key] = value
      else
        result[key].push(...value)
    }
  }

  return result
}

async function updateIndexREADME(indexes: PackageIndexes) {
  let readme = await fs.readFile('README.md', 'utf-8')

  const functions = stringifyCategories(mergeCategories([indexes.shared.categories, indexes.core.categories]))
  const addons = Object.values(indexes)
    .filter(i => i.info.addon && !i.info.deprecated)
    .map(({ categories, docs, info: { name, display, description } }) =>
      `\n- ${display} ([\`@vueuse/${name}\`](${docs})) - ${description}\n${
        stringifyCategories(categories, false)}`)
    .join('\n')

  readme = readme.replace(/<!--FUNCTIONS_LIST_STARTS-->[\s\S]+?<!--FUNCTIONS_LIST_ENDS-->/m, `<!--FUNCTIONS_LIST_STARTS-->\n\n${functions}<!--FUNCTIONS_LIST_ENDS-->`)
  readme = readme.replace(/<!--ADDONS_LIST_STARTS-->[\s\S]+?<!--ADDONS_LIST_ENDS-->/m, `<!--ADDONS_LIST_STARTS-->\n\n${addons}<!--ADDONS_LIST_ENDS-->`)

  await fs.writeFile('README.md', readme, 'utf-8')
}

export async function updatePackageJSON() {
  const { version } = await fs.readJSON('package.json')

  for (const { name, description, author } of activePackages) {
    const packageDir = path.join(srcDir, name)
    const packageJSONPath = path.join(packageDir, 'package.json')
    const packageJSON = await fs.readJSON(packageJSONPath)

    packageJSON.version = version
    packageJSON.description = description || packageJSON.description
    packageJSON.author = author || 'Anthony Fu<https://github.com/antfu>'
    packageJSON.bugs = {
      url: 'https://github.com/antfu/vueuse/issues',
    }
    packageJSON.homepage = name === 'core'
      ? 'https://github.com/antfu/vueuse#readme'
      : `https://github.com/antfu/vueuse/tree/master/packages/${name}#readme`

    for (const key of Object.keys(packageJSON.dependencies)) {
      if (key.startsWith('@vueuse/'))
        packageJSON.dependencies[key] = version
    }

    await fs.writeJSON(packageJSONPath, packageJSON, { spaces: 2 })
  }
}

async function run() {
  const indexes = await readIndexes()

  fs.writeJSON('indexes.json', indexes, { spaces: 2 })
  updateImport(indexes)
  updatePackageREADME(indexes)
  updateIndexREADME(indexes)
  updatePackageJSON()
}

run()
