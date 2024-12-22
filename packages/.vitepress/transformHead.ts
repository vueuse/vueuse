import type { HeadConfig, TransformContext } from 'vitepress'
import type { VueUseFunction } from '../metadata/types'
import fs from 'node:fs/promises'
import { basename, dirname } from 'node:path'
import removeMD from 'remove-markdown'
import sharp from 'sharp'
import { functions } from '../metadata/metadata'

const ogSVGPromise = fs.readFile('./scripts/og-template.svg', 'utf-8')

export async function transformHead({ pageData }: TransformContext) {
  const head: HeadConfig[] = []
  if (pageData.relativePath === 'index.md') {
    head.push(
      ['meta', { property: 'og:image', content: 'https://vueuse.org/og.png' }],
      ['meta', { property: 'twitter:image', content: 'https://vueuse.org/og.png' }],
    )
    return head
  }

  const file = pageData.relativePath
  const dirbase = basename(dirname(file))
  const fn = functions.find(i => i.name === dirbase)
  if (fn) {
    await generateSVG(fn, `packages/.vitepress/dist/og-${fn.name}.png`)
    head.push(
      ['meta', { property: 'og:image', content: `https://vueuse.org/og-${fn.name}.png` }],
      ['meta', { property: 'twitter:image', content: `https://vueuse.org/og-${fn.name}.png` }],
    )
  }

  return head
}

async function generateSVG(fn: VueUseFunction, output: string) {
  let desc = removeMD(fn.description!)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  desc = desc[0].toUpperCase() + desc.slice(1)
  const lines = desc.replace(/(?![^\n]{1,45}$)([^\n]{1,45})\s/g, '$1\n')
    .split('\n')
  const data = {
    name: fn.name,
    package: `@vueuse/${fn.package}`,
    line1: lines[0] || '',
    line2: lines[1] || '',
    line3: lines[2] || '',
  }
  const ogSVg = await ogSVGPromise
  const svg = ogSVg.replace(/\{\{([^}]+)\}\}/g, (_, name: keyof typeof data) => data[name])

  // eslint-disable-next-line no-console
  console.log(`Generating ${output}`)
  try {
    // eslint-disable-next-line node/prefer-global/buffer
    await sharp(Buffer.from(svg))
      .resize(1200 * 1.1, 630 * 1.1)
      .png()
      .toFile(output)
  }
  catch (e) {
    console.error('Error generating', { filename: output, ...data, svg })
    console.error(e)
  }
}
