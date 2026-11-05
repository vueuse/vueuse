import * as fs from 'node:fs/promises'
import process from 'node:process'
import { metadata } from '../packages/metadata/metadata'
import { updateContributors, updateCountBadge, updateFunctionREADME, updateFunctionsMD, updateImport, updateIndexREADME, updatePackageJSON, updatePackageREADME } from './utils'

async function run() {
  await Promise.all([
    updateImport(metadata),
    updatePackageREADME(metadata),
    updateIndexREADME(metadata),
    updateFunctionsMD(metadata),
    updateFunctionREADME(metadata),
    updatePackageJSON(metadata),
    updateCountBadge(metadata),
    process.env.NETLIFY && updateContributors(),
  ])

  await fs.copyFile('./CONTRIBUTING.md', './packages/contributing.md')
  // `@vueuse/core` ships the root README on npm. Generated here (and gitignored)
  // because a symlink did not survive every checkout or pack.
  await fs.copyFile('./README.md', './packages/core/README.md')
}

run()
