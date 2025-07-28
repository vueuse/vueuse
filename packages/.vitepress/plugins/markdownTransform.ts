import type { Plugin } from 'vite'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { format } from 'prettier'
import { createTwoslasher } from 'twoslash'
import ts from 'typescript'
import { packages } from '../../../meta/packages'
import { version as currentVersion } from '../../../package.json'
import { functionNames, getFunction } from '../../../packages/metadata/metadata'
import { getTypeDefinition, replacer } from '../../../scripts/utils'

export function MarkdownTransform(): Plugin {
  const DIR_TYPES = resolve(__dirname, '../../../types/packages')
  const hasTypes = existsSync(DIR_TYPES)

  if (!hasTypes)
    console.warn('No types dist found, run `npm run build:types` first.')

  const twoslasher = createTwoslasher({
    handbookOptions: { noErrors: true },
    customTags: ['include'],
  })

  return {
    name: 'vueuse-md-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.match(/\.md\b/))
        return null

      // linkify function names
      code = code.replace(
        new RegExp(`\`({${functionNames.join('|')}})\`(.)`, 'g'),
        (_, name, ending) => {
          if (ending === ']') // already a link
            return _
          const fn = getFunction(name)!
          return `[\`${fn.name}\`](${fn.docs})${ending}`
        },
      )
      // convert links to relative
      code = code.replace(/https?:\/\/vueuse\.org\//g, '/')

      const [pkg, _name, i] = id.split('/').slice(-3)

      const name = functionNames.find(n => n.toLowerCase() === _name.toLowerCase()) || _name

      if (functionNames.includes(name) && i === 'index.md') {
        const frontmatterEnds = code.indexOf('---\n\n')
        const firstHeader = code.search(/\n#{2,6}\s.+/)
        const sliceIndex = firstHeader < 0 ? frontmatterEnds < 0 ? 0 : frontmatterEnds + 4 : firstHeader

        // Add vue code blocks to twoslash by default
        code = await replaceAsync(code, /\n```vue( [^\n]+)?\n(.+?)\n```\n/gs, async (_, meta = '', snippet = '') => {
          meta = replaceToDefaultTwoslashMeta(meta)

          if (isMetaTwoslash(meta)) {
            snippet = injectCodeToTsVue(snippet, '// @include: imports')
          }

          return `
\`\`\`vue ${meta.trim()}
${snippet}
\`\`\`
`
        })

        // Insert JS/TS code blocks
        code = await replaceAsync(code, /\n```(?:ts|typescript)( [^\n]+)?\n(.+?)\n```\n/gs, async (_, meta = '', snippet = '') => {
          meta = replaceToDefaultTwoslashMeta(meta)

          let snippetForCompare = snippet
          if (isMetaTwoslash(meta)) {
            // remove twoslash notations
            snippetForCompare = twoslasher(snippet, 'ts').code

            // add vue auto imports
            snippet = `// @include: imports\n${snippet}`
          }
          const formattedTS = (await format(snippetForCompare.replace(/\n+/g, '\n'), { semi: false, singleQuote: true, parser: 'typescript' })).trim()
          const js = ts.transpileModule(formattedTS, {
            compilerOptions: { target: 99 },
          })
          const formattedJS = (await format(js.outputText, { semi: false, singleQuote: true, parser: 'typescript' }))
            .trim()
          if (formattedJS === formattedTS) {
            return `
\`\`\`ts ${meta}
${snippet}
\`\`\`
`
          }
          return `
<CodeToggle>
<div class="code-block-ts">

\`\`\`ts ${meta}
${snippet}
\`\`\`

</div>
<div class="code-block-js">

\`\`\`js
${formattedJS}
\`\`\`

</div>
</CodeToggle>\n`
        })

        const { footer, header } = await getFunctionMarkdown(pkg, name)

        if (hasTypes)
          code = replacer(code, footer, 'FOOTER', 'tail')
        if (header)
          code = code.slice(0, sliceIndex) + header + code.slice(sliceIndex)

        code = code
          .replace(/(# \w+)\n/, `$1\n\n<FunctionInfo fn="${name}"/>\n`)
          .replace(/## (Components?(?:\sUsage)?)/i, '## $1\n<LearnMoreComponents />\n\n')
          .replace(/## (Directives?(?:\sUsage)?)/i, '## $1\n<LearnMoreDirectives />\n\n')
      }

      return code
    },
  }
}

const DIR_SRC = resolve(__dirname, '../..')
const GITHUB_BLOB_URL = 'https://github.com/vueuse/vueuse/blob/main/packages'

export async function getFunctionMarkdown(pkg: string, name: string) {
  const URL = `${GITHUB_BLOB_URL}/${pkg}/${name}`

  const dirname = join(DIR_SRC, pkg, name)
  const demoPath = ['demo.vue', 'demo.client.vue'].find(i => existsSync(join(dirname, i)))
  const types = await getTypeDefinition(pkg, name)

  if (!types)
    console.warn(`No types found for ${pkg}/${name}`)

  let typingSection = ''

  if (types) {
    const code = `\`\`\`ts twoslash
// @include: imports
${types.trim()}
\`\`\``
    typingSection = types.length > 1000
      ? `
## Type Declarations

<details>
<summary op50 italic cursor-pointer select-none>Show Type Declarations</summary>

${code}

</details>
`
      : `\n## Type Declarations\n\n${code}`
  }

  const links = ([
    ['Source', `${URL}/index.ts`],
    demoPath ? ['Demo', `${URL}/${demoPath}`] : undefined,
    ['Docs', `${URL}/index.md`],
  ])
    .filter(i => i)
    .map(i => `[${i![0]}](${i![1]})`)
    .join(' • ')

  const sourceSection = `## Source\n\n${links}\n`
  const ContributorsSection = `
## Contributors

<Contributors fn="${name}" />
  `
  const changelogSection = `
## Changelog

<Changelog fn="${name}" />
`

  const demoSection = demoPath
    ? demoPath.endsWith('.client.vue')
      ? `
<script setup>
import { defineAsyncComponent } from 'vue'
const Demo = defineAsyncComponent(() => import('./${demoPath}'))
import DemoRaw from \'./${demoPath}\?raw'
import { useStore } from '@vue/repl'

const store = useStore({
  template: {
    value: {
        welcomeSFC: DemoRaw
    }
  }
})

const serialized = store.serialize()
</script>

## Demo

<DemoContainer>
<p class="demo-source-link"><a href="${URL}/${demoPath}" target="_blank">source</a><a :href="\`https://playground.vueuse.org/?vueuse=${currentVersion}\${serialized}\`" target="_blank">playground (beta)</a></p>
<ClientOnly>
  <Suspense>
    <Demo/>
    <template #fallback>
      Loading demo...
    </template>
  </Suspense>
</ClientOnly>
</DemoContainer>
`
      : `
<script setup>
import Demo from \'./${demoPath}\'
import DemoRaw from \'./${demoPath}\?raw'
import { useStore } from '@vue/repl'

const store = useStore({
  template: {
    value: {
        welcomeSFC: DemoRaw
    }
  }
})

const serialized = store.serialize()
</script>

## Demo

<DemoContainer>
<p class="demo-source-link"><a href="${URL}/${demoPath}" target="_blank">source</a><a :href="\`https://playground.vueuse.org/?vueuse=${currentVersion}\${serialized}\`" target="_blank">playground (beta)</a></p>
<Demo/>
</DemoContainer>
`
    : ''
  const packageNote = packages.find(p => p.name === pkg)!.addon
    ? `Available in the <a href="/${pkg}/README">@vueuse/${pkg}</a> add-on.\n`
    : ''

  const footer = `${typingSection}\n\n${sourceSection}\n${ContributorsSection}\n${changelogSection}\n`

  const header = demoSection + packageNote

  return {
    footer,
    header,
  }
}

function replaceAsync(str: string, match: RegExp, replacer: (substring: string, ...args: any[]) => Promise<string>) {
  const promises: Promise<string>[] = []
  str.replace(match, (...args) => {
    promises.push(replacer(...args))
    return ''
  })
  return Promise.all(promises).then(replacements => str.replace(match, () => replacements.shift()!))
}

const reLineHighlightMeta = /^\{[\d\-,]*\}$/

function createCounter({ min = -1, max = -1, logPer = 0 }: { min?: number, max?: number, logPer?: number } = {}) {
  let count = 0
  return () => {
    count++
    if (logPer && count % logPer === 0)
      // eslint-disable-next-line no-console
      console.log(`Counter: ${count}`)
    return (min < 0 || count >= min) && (max < 0 || count <= max)
  }
}

// XXX: only for testing purposes, remove later
// for limiting replace twoslash (max: 1200)
const runnable = createCounter({ min: 1, max: 300 })

/**
 * Replaces the given meta string with a default "twoslash" if it is empty or modifies it based on certain conditions.
 *
 * @param meta - The meta string to be processed.
 * @returns The processed meta string.
 *
 * If the meta string is empty or only contains whitespace, it returns "twoslash".
 * If the meta string contains "no-twoslash" (case insensitive), it removes "no-twoslash" and returns the remaining string.
 * If the remaining string is empty after removing "no-twoslash", it returns an empty string.
 * If the meta string matches the `reLineHighlightMeta` regex, it appends "twoslash" to the meta string.
 * Otherwise, it returns the trimmed meta string.
 */
function replaceToDefaultTwoslashMeta(meta: string) {
  const trimmed = meta.trim()

  if (!runnable())
    return trimmed

  if (!trimmed) {
    return 'twoslash'
  }
  const hasNoTwoslash = /no-twoslash/i.test(trimmed)
  if (hasNoTwoslash) {
    const leftover = trimmed.replace(/no-twoslash/i, '').trim()
    if (!leftover) {
      return ''
    }
    return leftover
  }
  if (reLineHighlightMeta.test(trimmed)) {
    return `${trimmed} twoslash`
  }
  return trimmed
}

function isMetaTwoslash(meta: string) {
  return meta.includes('twoslash') && !meta.includes('no-twoslash')
}

const scriptTagRegex = /<script[^>]+\blang=["']ts["'][^>]*>/i

function injectCodeToTsVue(vueContent: string, code: string): string {
  const match = vueContent.match(scriptTagRegex)
  if (!match) {
    return vueContent
  }

  const scriptTagStart = match.index!
  const scriptTagLength = match[0].length
  const insertPosition = scriptTagStart + scriptTagLength
  const updatedContent
    = `${vueContent.slice(0, insertPosition)
    }\n${code}${vueContent.slice(insertPosition)}`

  return updatedContent
}
