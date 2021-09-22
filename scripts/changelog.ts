import Git from 'simple-git'
import { CommitInfo } from '../meta/types'
import { uniq } from './utils'

const git = Git()

export async function getChangeLog(count = 200) {
  const logs = (await git.log({ maxCount: count })).all.filter(i =>
    i.message.includes('chore: release')
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
        .map(i => i.match(/^packages\/\w+?\/(\w+?)\/\w+?\.ts$/)?.[1])
        .filter(Boolean),
    )
  }

  return logs.filter(i => i.functions?.length || i.version)
}
