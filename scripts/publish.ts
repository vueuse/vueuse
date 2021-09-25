import { execSync } from 'child_process'
import path from 'path'
import consola from 'consola'
import { version } from '../package.json'
import { activePackages } from '../meta/packages'

execSync('npm run build', { stdio: 'inherit' })

let command = 'pnpm publish --access public'

if (version.includes('beta'))
  command += ' --tag beta'

for (const { name } of activePackages) {
  execSync(command, { stdio: 'inherit', cwd: path.join('packages', name, 'dist') })
  consola.success(`Published @vueuse/${name}`)
}
