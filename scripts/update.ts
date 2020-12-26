import fs from 'fs-extra'
import { readIndexes, updateFunctionREADME, updateImport, updateIndexREADME, updatePackageJSON, updatePackageREADME } from './utils'

async function run() {
  const indexes = await readIndexes()

  fs.writeJSON('indexes.json', indexes, { spaces: 2 })
  await updateImport(indexes)
  await updatePackageREADME(indexes)
  await updateIndexREADME(indexes)
  await updateFunctionREADME(indexes)
  await updatePackageJSON()
}

run()
