import fs from 'fs-extra'
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
    process.env.NETLIFY && updateCountBadge(metadata),
    process.env.NETLIFY && updateContributors(),
  ])

  await fs.copy('./CONTRIBUTING.md', './packages/contributing.md')
}

run()
