import fs from 'fs-extra'
import { readIndexes, updateCountBadge, updateFunctionREADME, updateFunctionsMD, updateImport, updateIndexREADME, updatePackageJSON, updatePackageREADME } from './utils'

async function run() {
  const indexes = await readIndexes()

  fs.writeJSON('indexes.json', indexes, { spaces: 2 })
  await Promise.all([
    updateImport(indexes),
    updatePackageREADME(indexes),
    updateIndexREADME(indexes),
    updateFunctionsMD(indexes),
    updateFunctionREADME(indexes),
    updatePackageJSON(indexes),
    updateCountBadge(indexes),
  ])

  await fs.copy('./CONTRIBUTING.md', './packages/contributing.md')
}

run()
