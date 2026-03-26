import { execSync } from 'node:child_process'
import { version } from '../package.json'

let command = 'pnpm publish -r --access public --no-git-checks'

if (version.includes('beta'))
  command += ' --tag beta'

if (version.includes('alpha'))
  command += ' --tag alpha'

execSync(command, { stdio: 'inherit' })
