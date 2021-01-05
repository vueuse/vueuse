import fs from 'fs-extra'
import { resolve } from 'path'

const ignorelist = [
  'random',
]

async function generate() {
  const lines = [
    'import { reactify } from \'@vueuse/shared\'',
    '',
  ]

  Object.getOwnPropertyNames(Math)
    .filter(key => !ignorelist.includes(key))
    .forEach((key) => {
      const value = Math[key]
      if (typeof value === 'function') {
        lines.push('/*@__PURE__*/')
        lines.push(`export const ${key} = reactify(Math.${key})`)
      }
    })

  lines.push('')

  await fs.writeFile(resolve(__dirname, '../math.ts'), lines.join('\n'), 'utf-8')
}

generate()
