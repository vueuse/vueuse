import { execSync as exec } from 'child_process'
import path from 'path'
import { build } from './build'
import { packages } from './packages'
import consola from 'consola'

const distDir = path.resolve(__dirname, '..', 'dist')

async function publish() {
  await build()

  for (const [pkg, { deprecated }] of packages as any) {
    if (deprecated)
      continue
    const packageDist = path.join(distDir, pkg)

    exec('yarn publish --access public --non-interactive', { stdio: 'inherit', cwd: packageDist })

    consola.success(`Published @vueuse/${pkg}`)
  }
}

async function cli() {
  try {
    publish()
  }
  catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export {
  publish,
}

if (require.main === module)
  cli()
