import path from 'path'
import fs from 'fs-extra'
import consola from 'consola'
import { packages } from './packages'
import { listFunctions } from './utils'

const srcDir = path.resolve(__dirname, '../packages')
const storybookUrl = 'https://vueuse.js.org'

export async function updateReadme() {
  const pkgs = [...packages].reverse()

  let addOnsList = ''

  for (const { name, display, description, deprecated } of pkgs) {
    if (deprecated)
      continue

    const packageDir = path.join(srcDir, name)
    const readmePath = name === 'core'
      ? path.resolve(__dirname, '../README.md')
      : path.join(srcDir, name, 'README.md')

    if (!fs.existsSync(readmePath))
      continue

    const functions = await listFunctions(packageDir, ['utils'])

    consola.info(`${functions.length} functions found for "${name}"`)

    const categories = {}
    for (const fnName of functions) {
      const raw = fs.readFileSync(path.join(packageDir, fnName, 'index.stories.tsx'), 'utf-8')
      const mdRaw = fs.readFileSync(path.join(packageDir, fnName, 'index.md'), 'utf-8')
      const match = /category: '(.+)',/gm.exec(raw) || /storiesOf\('(.+)'[\s\S]+?\.add\('(.+)'/gm.exec(raw)

      if (!match)
        continue

      let description = (mdRaw
        .replace(/\r\n/g, '\n')
        .match(/\n> (.+?)(?:, |\. |\n|\.\n)/) || []
      )[1] || ''

      if (description.includes('DEPRECATED'))
        continue

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
        url: `${storybookUrl}/?path=/story/${category.replace(/[|\s]/g, '-')}--${fnName}`.toLowerCase(),
        description,
      })
    }

    let functionList = '\n\n'

    if (name !== 'core')
      addOnsList += `\n- ${display} ([\`@vueuse/${name}\`](${storybookUrl}/?path=/story/add-ons-${name}--read-me)) - ${description}\n`

    for (const category of Object.keys(categories).sort()) {
      functionList += `- ${category}\n`
      for (const { name: categoryName, url, description } of categories[category]) {
        const desc = description ? ` — ${description}` : ''
        functionList += `  - [\`${categoryName}\`](${url})${desc}\n`
        if (name !== 'core')
          addOnsList += `  - [\`${categoryName}\`](${url})${desc}\n`
      }
      functionList += '\n'
    }

    let readme = await fs.readFile(readmePath, 'utf-8')
    readme = readme.replace(/<!--FUNCTIONS_LIST_STARTS-->[\s\S]+?<!--FUNCTIONS_LIST_ENDS-->/m, `<!--FUNCTIONS_LIST_STARTS-->${functionList}<!--FUNCTIONS_LIST_ENDS-->`)

    if (name === 'core')
      readme = readme.replace(/<!--ADDONS_LIST_STARTS-->[\s\S]+?<!--ADDONS_LIST_ENDS-->/m, `<!--ADDONS_LIST_STARTS-->${addOnsList}<!--ADDONS_LIST_ENDS-->`)

    await fs.writeFile(readmePath, readme, 'utf-8')

    consola.success(`README.md for "${name}" updated`)
  }
}

if (require.main === module)
  updateReadme()
