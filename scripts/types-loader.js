const path = require('path')
const fs = require('fs-extra')
const parser = require('prettier/parser-typescript')
const prettier = require('prettier/standalone')

const GITHUB_URL = 'https://github.com/antfu/vueuse/blob/master/packages'
const VUE_REACTIVITY_USE = 'https://github.com/vue-reactivity/use'

module.exports = function(source, u) {
  let request = this._module.request

  request = request.replace(/\\/g, '/')

  if (!request.endsWith('/index.md'))
    return source

  const [pkg] = request.split('/').slice(-3, -2)

  if (!pkg)
    return source

  const moduleName = path.basename(path.dirname(request))

  const typingFilepath = path.resolve(__dirname, `../types/packages/${pkg}/${moduleName}/index.d.ts`)

  if (!fs.existsSync(typingFilepath))
    return source

  const typing = fs.readFileSync(typingFilepath, 'utf-8')

  if (!typing)
    return source

  // clean up types
  const text = typing
    .replace(/import\(.*?\)\./g, '')
    .replace(/import[\s\S]+?from ?["'][\s\S]+?["']/g, '')

  const URL = `${GITHUB_URL}/${pkg}/${moduleName}`

  const formatted = prettier.format(text, { semi: false, parser: 'typescript', plugins: [parser] })

  const head = pkg === 'shared'
    ? `💡 this function is also available in [Vue Reactivity](${VUE_REACTIVITY_USE})\n\n`
    : pkg !== 'core'
      ? `📦 this function is available in [\`@vueuse/${pkg}\`](/?path=/story/${pkg}--readme)\n\n`
      : ''

  const typingSection = `## Typing\n\n\`\`\`typescript\n${formatted.trim()}\n\`\`\``

  const sourceSection = `## Source\n\n[Source](${URL}/index.ts) • [Demo](${URL}/index.stories.tsx) • [Docs](${URL}/index.md)\n`

  return `${head}${source}\n\n${typingSection}\n\n${sourceSection}\n`
}
