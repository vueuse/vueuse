import { dirname, join } from 'path'
import fs from 'fs-extra'
import prettier from 'prettier'
import fg from 'fast-glob'

async function rewrite(dir: string) {
  const story = await fs.readFile(join(dir, 'index.stories.tsx'), 'utf-8')

  let setup = story.match(/setup\(\) {([\s\S]+?)},\s+template/m)?.[1].trim()
  const template = story.match(/html`([\s\S]+?)`,/m)?.[1].trim()
  // @ts-ignore
  const imports = Array.from(story.matchAll(/import .+ from '(.+?)'/g))
    .filter(i => i[1] !== '../../_docs')
    .map(i => i[0])

  setup = setup.replace(/return {\s+([\s\S]+)}$/m, (m) => {
    m = m.replace(/return {\s+([\s\S]+)}$/m, '$1')
    return `const ${m.replace(/(\w+): /g, '$1 = ')}`
  })

  const sfc = prettier.format(
    `<script setup lang="ts">${imports.join('\n')}\n\n${setup}</script>\n\n<template>${template}</template>`,
    { parser: 'vue', singleQuote: true, semi: false },
  )

  await fs.writeFile(join(dir, 'demo.vue'), sfc, 'utf-8')
  console.log(dir)
}

async function run() {
  const files = await fg('packages/*/*/index.stories.tsx')
  await Promise.all(files.map(i => rewrite(dirname(i))))
}

run()
