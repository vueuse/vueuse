import fs from 'fs-extra'

async function run() {
  // await fs.copy('./README.md', './packages/index.md')
  await fs.copy('./docs', './packages/')
  await fs.copy('./CONTRIBUTING.md', './packages/contributing.md')
}

run()
