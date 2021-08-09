import { execSync } from 'child_process'
import path from 'path'
import { activePackages } from '../meta/packages'
import consola from 'consola'
import { version } from '../package.json'

execSync('npm run build', { stdio: 'inherit' })

let command = 'npm publish --access public'

if (version.includes('beta'))
  command += ' --tag beta'

for (const { name } of activePackages) {
  execSync(command, { stdio: 'inherit', cwd: path.join('packages', name, 'dist') })
  consola.success(`Published @vueuse/${name}`)
}
