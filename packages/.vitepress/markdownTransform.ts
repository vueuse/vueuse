import { resolve } from 'path'
import { Plugin } from 'vite'
import fs from 'fs-extra'
import { functionNames, getFunction } from '../../meta/function-indexes'
import { getFunctionFooter, getFunctionHead, hasDemo, replacer } from '../../scripts/utils'

export function MarkdownTransform(): Plugin {
  const DIR_TYPES = resolve(__dirname, '../../types/packages')
  const hasTypes = fs.existsSync(DIR_TYPES)

  if (!hasTypes)
    console.warn('No types dist found, run `npm run build:types` first.')

  return {
    name: 'vueuse-md-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.md'))
        return null

      // linkify function names
      code = code.replace(
        new RegExp(`\`({${functionNames.join('|')}})\`(.)`, 'g'),
        (_, name, ending) => {
          if (ending === ']') // already a link
            return _
          const fn = getFunction(name)!
          return `[\`${fn.name}\`](${fn.docs})`
        },
      )
      // convert links to relative
      code = code.replace(/https?:\/\/vueuse\.org\//g, '/')

      const [pkg, name, i] = id.split('/').slice(-3)

      if (functionNames.includes(name) && i === 'index.md') {
        const frontmatterEnds = code.indexOf('---\n\n') + 4
        const firstSubheader = code.search(/\n## \w/)
        const sliceIndex = firstSubheader < 0 ? frontmatterEnds : firstSubheader

        if (hasTypes)
          code = replacer(code, await getFunctionFooter(pkg, name), 'FOOTER', 'tail')

        code = code.replace(/## Component/, '## Component\n<LearnMoreComponents />\n')

        let header = ''
        if (hasDemo(pkg, name))
          header = '\n<script setup>\nimport Demo from \'./demo.vue\'\n</script>\n## Demo\n<DemoContainer><Demo/></DemoContainer>\n'

        header += getFunctionHead(pkg, name)

        if (header)
          code = code.slice(0, sliceIndex) + header + code.slice(sliceIndex)
      }

      return code
    },
  }
}
