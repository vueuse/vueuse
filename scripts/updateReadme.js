const path = require('path')
const fs = require('fs-extra')
const consola = require('consola')
const packages = require('./packages')

const srcDir = path.resolve(__dirname, '../packages')
const storybookUrl = 'https://vueuse.js.org'

async function updateReadme () {
  for (const [pkg] of packages) {
    const packageDir = path.join(srcDir, pkg)
    const readmePath = pkg === 'core'
      ? path.resolve(__dirname, '../README.md')
      : path.join(srcDir, pkg, 'README.md')

    const functions = fs
      .readdirSync(packageDir)
      .filter(f => f.startsWith('use'))
      .sort()

    consola.info(`${functions.length} functions found for "${pkg}"`)

    const categories = {}
    for (const name of functions) {
      const raw = fs.readFileSync(path.join(packageDir, name, 'index.stories.tsx'), 'utf-8')
      const match = /storiesOf\('(.+)'[\s\S]+?\.add\('(.+)'/gm.exec(raw)

      if (!match)
        continue

      const [, category] = match

      if (!category)
        continue

      const categoryName = category.split('|').slice(-1).join(' ')

      if (!categories[categoryName])
        categories[categoryName] = []

      categories[categoryName].push({
        name,
        url: `${storybookUrl}/?path=/story/${category.replace(/\|/g, '-')}--${name}`.toLowerCase(),
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

    consola.success(`README.md for "${pkg}" updated`)
  }
}

module.exports = { updateReadme }

if (require.main === module)
  updateReadme()
