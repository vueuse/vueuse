const path = require('path')
const fs = require('fs-extra')
const consola = require('consola')

const srcDir = path.resolve(__dirname, '../packages/core')
const readmePath = path.resolve(__dirname, '../README.md')
const storybookUrl = 'https://vueuse.js.org'

async function updateReadme () {
  const functions = fs
    .readdirSync(srcDir)
    .filter(f => f.startsWith('use'))
    .sort()

  consola.info(`${functions.length} functions found`)

  const categories = {}
  for (const name of functions) {
    const raw = fs.readFileSync(path.join(srcDir, name, 'index.stories.tsx'), 'utf-8')
    const match = /storiesOf\('(\w+)'[\s\S]+?\.add\('(\w+)'/gm.exec(raw)

    if (!match)
      continue

    const [, category] = match

    if (!category)
      continue

    if (!categories[category])
      categories[category] = []

    categories[category].push({
      name,
      url: `${storybookUrl}/?path=/story/${category}--${name}`.toLowerCase(),
    })
  }

  let text = '\n\n'

  for (const category of Object.keys(categories).sort()) {
    text += `- ${category}\n`
    for (const { name, url } of categories[category])
      text += `  - [\`${name}\`](${url})\n`
    text += '\n'
  }

  let readme = fs.readFileSync(readmePath, 'utf-8')
  readme = readme.replace(/<!--FUNCTIONS_LIST_STARTS-->[\s\S]+?<!--FUNCTIONS_LIST_ENDS-->/m, `<!--FUNCTIONS_LIST_STARTS-->${text}<!--FUNCTIONS_LIST_ENDS-->`)
  fs.writeFileSync(readmePath, readme, 'utf-8')

  consola.success('README.md updated')
}

module.exports = { updateReadme }

if (require.main === module)
  updateReadme()
