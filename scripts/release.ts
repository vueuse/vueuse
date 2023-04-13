import { execSync } from 'node:child_process'
import { readJSONSync } from 'fs-extra'
import { updateContributors } from './utils'

const { version: oldVersion } = readJSONSync('package.json')

execSync('bumpp --no-commit --no-tag --no-push', { stdio: 'inherit' })

const { version } = readJSONSync('package.json')

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
