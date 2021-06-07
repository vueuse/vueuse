import { execSync } from 'child_process'
import path from 'path'
import { activePackages } from '../meta/packages'
import consola from 'consola'

execSync('npm run build', { stdio: 'inherit' })

for (const { name } of activePackages) {
  execSync('npm publish --access public', { stdio: 'inherit', cwd: path.join('packages', name, 'dist') })
  consola.success(`Published @vueuse/${name}`)
}
