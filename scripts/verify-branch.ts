import { execSync } from 'node:child_process'
import process from 'node:process'

const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()

if (branch === 'main') {
  console.error('Refusing to release from "main". Create a branch, run the release there, and open a PR.')
  process.exit(1)
}
