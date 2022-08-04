import md5 from 'md5'
import Git from 'simple-git'
import type { CommitInfo, ContributorInfo } from '@vueuse/metadata'
import { functions } from '@vueuse/metadata'
import { uniq } from './utils'

const git = Git({
  maxConcurrentProcesses: 200,
})
let cache: CommitInfo[] | undefined

export async function getChangeLog(count = 200) {
  if (cache)
    return cache

  const logs = (await git.log({ maxCount: count })).all.filter(i =>
    i.message.includes('chore: release')
    || i.message.includes('!')
    || i.message.startsWith('feat')
    || i.message.startsWith('fix'),
  ) as CommitInfo[]

  for (const log of logs) {
    if (log.message.includes('chore: release')) {
      log.version = log.message.split(' ')[2].trim()
      continue
    }
    const raw = await git.raw(['diff-tree', '--no-commit-id', '--name-only', '-r', log.hash])
    delete log.body
    const files = raw.replace(/\\/g, '/').trim().split('\n')
    log.functions = uniq(
      files
        .map(i => i.match(/^packages\/\w+\/(\w+)\/\w+?\.ts$/)?.[1])
        .filter(Boolean),
    )
  }

  const result = logs.filter(i => i.functions?.length || i.version)
  cache = result
  return result
}

export async function getContributorsAt(path: string) {
  try {
    const list = (await git.raw(['log', '--pretty=format:"%an|%ae"', '--', path]))
      .split('\n')
      .map(i => i.slice(1, -1).split('|') as [string, string])
    const map: Record<string, ContributorInfo> = {}

    list
      .filter(i => i[1])
      .forEach((i) => {
        if (!map[i[1]]) {
          map[i[1]] = {
            name: i[0],
            count: 0,
            hash: md5(i[1]),
          }
        }
        map[i[1]].count++
      })

    return Object.values(map).sort((a, b) => b.count - a.count)
  }
  catch (e) {
    console.error(e)
    return []
  }
}

export async function getFunctionContributors() {
  const result = await Promise.all(functions.map(async (i) => {
    return [i.name, await getContributorsAt(`packages/${i.package}/${i.name}`)] as const
  }))
  return Object.fromEntries(result)
}
