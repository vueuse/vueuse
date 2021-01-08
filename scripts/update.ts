import fs from 'fs-extra'
import { readIndexes, updateFunctionREADME, updateFunctionsMD, updateImport, updateIndexREADME, updatePackageJSON, updatePackageREADME } from './utils'

async function run() {
  const indexes = await readIndexes()

  fs.writeJSON('indexes.json', indexes, { spaces: 2 })
  await updateImport(indexes)
  await updatePackageREADME(indexes)
  await updateIndexREADME(indexes)
  await updateFunctionsMD(indexes)
  await updateFunctionREADME(indexes)
  await updatePackageJSON()

  await fs.copy('./CONTRIBUTING.md', './packages/contributing.md')
}

run()
