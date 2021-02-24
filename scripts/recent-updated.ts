import Git from 'simple-git'
import { stringifyFunctions } from './utils'
import { functionNames, functions } from '../meta/function-indexes'
import fs from 'fs-extra'
import { resolve } from 'path'

const git = Git()

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr))
}

export async function generateRecentUpdated() {
  const logs = await git.log({ maxCount: 100 })
  const hashMaps: Record<string, string> = {}
  const names = uniq(
    logs.all
      .map((i) => {
        const name = i.message.match(/^\w+!?\((\w+)\)!?:/)?.[1]
        if (name && functionNames.includes(name)) {
          if (!hashMaps[name])
            hashMaps[name] = i.hash
          return name
        }
        return null
      })
      .filter(i => i),
  )
  const news = names.slice(0, 7)
  let md = stringifyFunctions(
    news
      .map((name) => {
        const fn = functions.find(i => i.name === name)
        if (fn) {
          const hash = hashMaps[name]
          return {
            ...fn,
            description: `${fn.description} ([\`${hash.slice(0, 5)}\`](https://github.com/vueuse/vueuse/commit/${hash}))`,
          }
        }
        return null
      })
      .filter(i => i),
    false,
  ).replace(/\n+/g, '\n')

  md = `# Recent updated

${md}

Go back to the [full-list](/functions)
`

  await fs.writeFile(resolve(__dirname, '../packages/recent-updated.md'), md, 'utf-8')
}

generateRecentUpdated()
