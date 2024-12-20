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
}

run()
