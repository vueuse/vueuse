import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'
import removeMd from 'remove-markdown'
import { glob } from 'tinyglobby'

const DOCS_DIR = path.resolve(process.cwd(), 'packages')
const OUTPUT_FILE = path.resolve(process.cwd(), 'packages/.vitepress/dist/llms.txt')
const PUBLIC_OUTPUT_FILE = path.resolve(process.cwd(), 'packages/.vitepress/public/llms.txt')

// Base URL for the documentation
const BASE_URL = 'https://vueuse.org'

async function run() {
  console.log('Generating llms.txt...')

  const files = await glob(['**/*.md'], {
    cwd: DOCS_DIR,
    ignore: ['node_modules', '.vitepress', '**/demo.md', '**/index.zh-CN.md'],
  })

  let content = `# VueUse\n\n> Collection of essential Vue Composition Utilities\n\n## Documentation\n\n`

  const items: { title: string, link: string, desc: string, category?: string }[] = []

  for (const file of files) {
    const filePath = path.join(DOCS_DIR, file)
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data, content: mdContent } = matter(raw)

    if (!data.category && !file.includes('guide'))
      continue

    // Extract title (first h1)
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    const titleMatch = mdContent.match(/^#\s+(.+)$/m)
    const title = titleMatch ? titleMatch[1].trim() : path.basename(path.dirname(file))

    // Extract description (first paragraph after title)
    let desc = ''
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    const descMatch = mdContent.replace(/^#\s+.+$/m, '').trim().match(/^.+$/m)
    if (descMatch) {
      desc = removeMd(descMatch[0]).trim()
    }

    // Construct link
    // packages/core/useTitle/index.md -> /core/useTitle/
    // packages/guide/index.md -> /guide/
    const link = `/${file.replace(/\/index\.md$/, '/').replace(/\.md$/, '')}`

    items.push({
      title,
      link: BASE_URL + link,
      desc,
      category: data.category,
    })
  }

  // Sort by category then title
  items.sort((a, b) => {
    if (a.category && !b.category)
      return 1
    if (!a.category && b.category)
      return -1
    if (a.category !== b.category)
      return (a.category || '').localeCompare(b.category || '')
    return a.title.localeCompare(b.title)
  })

  let currentCategory = ''
  for (const item of items) {
    if (item.category && item.category !== currentCategory) {
      content += `\n### ${item.category}\n\n`
      currentCategory = item.category
    }
    content += `- [${item.title}](${item.link}): ${item.desc}\n`
  }

  // Ensure directories exist
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true })
  await fs.mkdir(path.dirname(PUBLIC_OUTPUT_FILE), { recursive: true })

  // Write to both dist (for post-build) and public (for dev/local preview)
  // Note: VitePress copies 'public' to 'dist' on build, so writing to public is usually enough for source
  await fs.writeFile(PUBLIC_OUTPUT_FILE, content, 'utf-8')

  console.log(`Generated llms.txt at ${PUBLIC_OUTPUT_FILE}`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
