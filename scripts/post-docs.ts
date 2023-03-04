import { basename, dirname } from 'node:path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import sharp from 'sharp'
import removeMD from 'remove-markdown'
import { functions } from '../packages/metadata/metadata'
import type { VueUseFunction } from '../packages/metadata/types'

const ogSVg = fs.readFileSync('./scripts/og-template.svg', 'utf-8')

async function generateSVG(fn: VueUseFunction, output: string) {
  let desc = removeMD(fn.description!)
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
  const svg = ogSVg.replace(/\{\{([^}]+)}}/g, (_, name: keyof typeof data) => data[name])

  console.log(`Generating ${output}`)
  await sharp(Buffer.from(svg))
    .resize(1200 * 1.1, 630 * 1.1)
    .png()
    .toFile(output)
}

export async function fix() {
  const names = await fg('packages/.vitepress/dist/**/*.html', { onlyFiles: true })

  await Promise.all(names.map(async (file) => {
    let html = await fs.readFile(file, 'utf-8')

    const dirbase = basename(dirname(file))
    const fn = functions.find(i => i.name === dirbase)
    if (fn) {
      await generateSVG(fn, `packages/.vitepress/dist/og-${fn.name}.png`)
      html = html.replace(
        /vueuse\.org\/og\.png/g,
        `vueuse.org/og-${fn.name}.png`.toLocaleLowerCase(),
      )
    }

    if (!html.includes('navigator.serviceWorker.register')) {
      html = html.replace(
        '</head>',
        `
<link rel="manifest" href="/manifest.webmanifest">
<script>
if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: './' })
  })
}
</script>
</head>`).trim()
    }

    await fs.writeFile(file, html, 'utf-8')

    // console.log(i)
  }))
}

fix()
