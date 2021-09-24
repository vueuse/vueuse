import { join } from 'path'
import { execSync, ExecSyncOptions } from 'child_process'
import { readIndexes } from './utils'

async function run() {
  const { packages } = await readIndexes()

  const packagesToInstall = Object.values(packages)
    .filter(pkg => pkg.installDependencies)
    .map(pkg => pkg.name)

  const total = packagesToInstall.length

  packagesToInstall.forEach((pkg, i) => {
    const execConfig = {
      cwd: join(process.cwd(), './packages', pkg),
      stdio: 'inherit',
    } as ExecSyncOptions

    execSync(`echo "[${i + 1}/${total}] Installing dependencies for @vueuse/${pkg} package..."`, execConfig)
    execSync('yarn install --no-lockfile', execConfig)
  })
}

run()
