import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import process from 'node:process'
import { updateContributors } from './utils'

const { version: oldVersion } = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }))

execSync('bumpp --no-commit --no-tag --no-push', { stdio: 'inherit' })

const { version } = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }))

if (oldVersion === version) {
  console.log('canceled')
  process.exit()
}

updateContributors()

execSync('npm run build:types', { stdio: 'inherit' })
execSync('npm run update', { stdio: 'inherit' })
execSync('git add .', { stdio: 'inherit' })

execSync(`git commit -m "chore: release v${version}"`, { stdio: 'inherit' })
execSync(`git tag -a v${version} -m "v${version}"`, { stdio: 'inherit' })
