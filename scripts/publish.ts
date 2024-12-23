import { execSync } from 'node:child_process'
import { version } from '../package.json'

execSync('npm run build', { stdio: 'inherit' })

let command = 'pnpm publish -r --access public'

if (version.includes('beta'))
  command += ' --tag beta'

execSync(command, { stdio: 'inherit' })
