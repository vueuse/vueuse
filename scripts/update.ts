import fs from 'fs-extra'
import { metadata } from '../packages/metadata/metadata'
import { updateFunctionREADME, updateFunctionsMD, updateImport, updateIndexREADME, updatePackageJSON, updatePackageREADME } from './utils'

async function run() {
  await updateImport(metadata)
  await updatePackageREADME(metadata)
  await updateIndexREADME(metadata)
  await updateFunctionsMD(metadata)
  await updateFunctionREADME(metadata)
  await updatePackageJSON(metadata)

  await fs.copy('./CONTRIBUTING.md', './packages/contributing.md')
}

run()
