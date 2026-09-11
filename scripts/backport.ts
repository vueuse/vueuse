/**
 * Backport commits from a development branch (default `main`) to the current
 * branch, e.g. a legacy release branch like `v13`.
 *
 * Breaking changes are excluded by default, and every candidate can be toggled
 * interactively before anything is applied.
 *
 * Usage:
 *   npx tsx scripts/backport.ts [options]
 *
 * Options:
 *   --from <ref>          Source branch to pick from (default: `main`)
 *   --limit <n>           Only consider the latest `n` candidates
 *   --include-breaking    List breaking changes as well (unselected by default)
 *   --dry-run             Print what would be picked, without touching the tree
 *   -y, --yes             Skip the prompt and pick every pre-selected commit
 *   -h, --help            Show this message
 */

import { execFileSync } from 'node:child_process'
import process from 'node:process'
import { parseArgs } from 'node:util'
import { consola } from 'consola'
import { colors } from 'consola/utils'

interface Commit {
  hash: string
  short: string
  subject: string
  body: string
  author: string
  date: string
  breaking: boolean
}

const SEP = '\x1F'
const EOL = '\x1E'

const { values: args } = parseArgs({
  options: {
    'from': { type: 'string', default: 'main' },
    'limit': { type: 'string' },
    'include-breaking': { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
    'yes': { type: 'boolean', short: 'y', default: false },
    'help': { type: 'boolean', short: 'h', default: false },
  },
})

if (args.help) {
  console.log(`
${colors.bold('Backport commits from a development branch to the current branch.')}

  npx tsx scripts/backport.ts [options]

  --from <ref>          Source branch to pick from (default: main)
  --limit <n>           Only consider the latest n candidates
  --include-breaking    List breaking changes as well (unselected by default)
  --dry-run             Print what would be picked, without touching the tree
  -y, --yes             Skip the prompt and pick every pre-selected commit
  -h, --help            Show this message
`)
  process.exit(0)
}

function git(...cmd: string[]): string {
  return execFileSync('git', cmd, { encoding: 'utf-8' }).trim()
}

function tryGit(...cmd: string[]): string | undefined {
  try {
    return git(...cmd)
  }
  catch {
    return undefined
  }
}

function fatal(message: string, hint?: string): never {
  consola.error(message)
  if (hint)
    consola.info(hint)
  process.exit(1)
}

function isBreaking(subject: string, body: string): boolean {
  // `feat(core)!: ...` or a `BREAKING CHANGE:` footer
  return /^\w+(?:\([^)]*\))?!:/.test(subject)
    || /^BREAKING[ -]CHANGE:/m.test(body)
}

function parseCommits(raw: string): Commit[] {
  return raw
    .split(EOL)
    .map(i => i.trim())
    .filter(Boolean)
    .map((entry) => {
      const [hash, subject, author, date, body = ''] = entry.split(SEP)
      return {
        hash,
        short: hash.slice(0, 7),
        subject,
        author,
        date,
        body,
        breaking: isBreaking(subject, body),
      }
    })
}

function resolveSource(ref: string): string {
  if (tryGit('rev-parse', '--verify', '--quiet', `${ref}^{commit}`))
    return ref
  // fall back to the remote tracking branch, so `--from main` works on a
  // checkout that never created a local `main`
  if (!ref.includes('/') && tryGit('rev-parse', '--verify', '--quiet', `origin/${ref}^{commit}`))
    return `origin/${ref}`
  return fatal(`Cannot resolve source ref ${colors.yellow(ref)}`)
}

/**
 * Commits already backported with `git cherry-pick -x`. Patch-id matching
 * (`git log --cherry-pick`) misses those that needed conflict resolution,
 * the recorded source hash does not.
 */
function getPickedHashes(source: string): Set<string> {
  const base = tryGit('merge-base', 'HEAD', source)
  const range = base ? `${base}..HEAD` : 'HEAD'
  const log = tryGit('log', range, '--format=%B') ?? ''
  const hashes = new Set<string>()
  for (const [, hash] of log.matchAll(/cherry picked from commit ([0-9a-f]{7,40})/gi))
    hashes.add(hash.toLowerCase())
  return hashes
}

function label(commit: Commit): string {
  const flag = commit.breaking ? `${colors.red('!')} ` : ''
  return `${colors.yellow(commit.short)} ${flag}${commit.subject}`
}

async function selectCommits(commits: Commit[]): Promise<Commit[]> {
  if (args.yes)
    return commits.filter(i => !i.breaking)

  if (!process.stdin.isTTY)
    fatal(`Not a TTY, pass ${colors.cyan('--yes')} to run non-interactively`)

  const answer = await consola.prompt('Select the commits to backport', {
    type: 'multiselect',
    required: false,
    cancel: 'symbol',
    options: commits.map(commit => ({
      value: commit.hash,
      label: label(commit),
      hint: `${commit.date} · ${commit.author}${commit.breaking ? ' · breaking' : ''}`,
    })),
    initial: commits.filter(i => !i.breaking).map(i => i.hash),
  }) as unknown as string[] | symbol

  if (typeof answer === 'symbol')
    fatal('Aborted')

  const set = new Set(answer)
  return commits.filter(i => set.has(i.hash))
}

const current = git('rev-parse', '--abbrev-ref', 'HEAD')

if (current === 'HEAD')
  fatal('You are in a detached HEAD state, checkout the target branch first')

const source = resolveSource(args.from!)

if (git('rev-parse', source) === git('rev-parse', 'HEAD'))
  fatal(`The current branch ${colors.yellow(current)} is already at ${colors.yellow(source)}`)

if (tryGit('rev-parse', '--verify', '--quiet', 'CHERRY_PICK_HEAD')) {
  fatal(
    'A cherry-pick is already in progress',
    `Run ${colors.cyan('git cherry-pick --continue')} or ${colors.cyan('git cherry-pick --abort')} first`,
  )
}

if (!args['dry-run'] && git('status', '--porcelain'))
  fatal('The working tree is dirty, commit or stash your changes first')

const picked = getPickedHashes(source)

// `--cherry-pick --right-only` lists commits in `source` that have no
// patch-equivalent counterpart on the current branch
const candidates = parseCommits(git(
  'log',
  '--no-merges',
  '--cherry-pick',
  '--right-only',
  `--format=%H${SEP}%s${SEP}%an${SEP}%ad${SEP}%b${EOL}`,
  '--date=short',
  `HEAD...${source}`,
))
  .filter(commit => !picked.has(commit.hash.toLowerCase()))
  .reverse() // oldest first, the order they have to be applied in

const breaking = candidates.filter(i => i.breaking)
const limit = args.limit ? Number.parseInt(args.limit, 10) : 0
const listed = (args['include-breaking'] ? candidates : candidates.filter(i => !i.breaking))
  .slice(limit > 0 ? -limit : 0)

consola.info(`Backporting ${colors.yellow(source)} → ${colors.yellow(current)}`)

if (!candidates.length) {
  consola.success('Nothing to backport, the branch is up to date')
  process.exit(0)
}

if (breaking.length && !args['include-breaking'])
  consola.info(`Filtered out ${colors.red(`${breaking.length} breaking`)} commit(s), pass ${colors.cyan('--include-breaking')} to list them`)

if (limit > 0 && candidates.length > listed.length)
  consola.info(`Showing the latest ${listed.length} of ${candidates.length} candidate(s)`)

if (!listed.length) {
  consola.success('No candidates left after filtering')
  process.exit(0)
}

const selected = await selectCommits(listed)

if (!selected.length) {
  consola.warn('No commits selected')
  process.exit(0)
}

if (args['dry-run']) {
  consola.info(`${selected.length} commit(s) would be cherry-picked:`)
  for (const commit of selected)
    console.log(`  ${label(commit)}`)
  process.exit(0)
}

let done = 0
let skipped = 0

for (const [index, commit] of selected.entries()) {
  console.log(`${colors.dim(`[${index + 1}/${selected.length}]`)} ${label(commit)}`)

  try {
    execFileSync('git', ['cherry-pick', '-x', commit.hash], { stdio: 'pipe' })
    done++
  }
  catch {
    const inProgress = tryGit('rev-parse', '--verify', '--quiet', 'CHERRY_PICK_HEAD')
    const conflicts = tryGit('diff', '--name-only', '--diff-filter=U')

    // the change is already present in a different shape, nothing left to apply
    if (inProgress && !conflicts) {
      tryGit('cherry-pick', '--skip')
      consola.warn(`  Skipped ${colors.yellow(commit.short)}, it results in an empty commit`)
      skipped++
      continue
    }

    consola.error(`Conflict while picking ${colors.yellow(commit.short)} ${commit.subject}`)
    if (conflicts)
      console.log(conflicts.split('\n').map(i => `  ${colors.red(i)}`).join('\n'))

    const remaining = selected.slice(index + 1)
    consola.box([
      `Resolve the conflict, then ${colors.cyan('git add <files>')} and ${colors.cyan('git cherry-pick --continue')}`,
      `Or drop this commit with ${colors.cyan('git cherry-pick --abort')}`,
      remaining.length
        ? `\nAfterwards re-run this script, ${remaining.length} commit(s) are still pending:\n${remaining.map(i => `  ${label(i)}`).join('\n')}`
        : '',
    ].filter(Boolean).join('\n'))

    process.exit(1)
  }
}

consola.success(`Backported ${done} commit(s) to ${colors.yellow(current)}${skipped ? `, skipped ${skipped} empty` : ''}`)
consola.info(`Review with ${colors.cyan(`git log --oneline -n ${done}`)} before pushing`)
