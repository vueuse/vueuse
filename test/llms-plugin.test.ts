import { spawn } from 'node:child_process'
import { readFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const fixtureRoot = path.resolve(process.cwd(), 'test/fixtures/llms-docs')
const distDir = path.resolve(fixtureRoot, '.vitepress/dist')
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'

async function runVitepressBuild() {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(pnpmCommand, ['exec', 'vitepress', 'build', fixtureRoot], {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production',
      },
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0)
        resolve()
      else
        reject(new Error(`vitepress build exited with code ${code}`))
    })
  })
}

beforeAll(async () => {
  await rm(distDir, { recursive: true, force: true })
  await runVitepressBuild()
}, 60_000)

afterAll(async () => {
  await rm(distDir, { recursive: true, force: true })
})

describe('vitepress-plugin-llms integration', () => {
  it('emits llms.txt with sidebar links', async () => {
    const llmsTxtPath = path.join(distDir, 'llms.txt')
    const content = await readFile(llmsTxtPath, 'utf-8')
    expect(content).toContain('# VueUse LLM Fixture')

    expect(content).toContain('### Guide')
    expect(content).toContain('- [Getting Started](/guide/getting-started.md): Walk through the minimal steps required to read the fixture docs.')
    expect(content).toContain('- [Key Concepts](/guide/concepts.md): Explains why the llms fixture exists.')
  })

  it('emits llms-full.txt with merged markdown', async () => {
    const llmsFullPath = path.join(distDir, 'llms-full.txt')
    const content = await readFile(llmsFullPath, 'utf-8')
    expect(content).toContain('# Getting Started')
    expect(content).toContain('# Key Concepts')
    expect(content).toContain('Included in LLM exports.')
    expect(content).not.toContain('Excluded from LLM exports.')
  })

  it('creates markdown versions for each page', async () => {
    const markdownCopy = path.join(distDir, 'guide/getting-started.md')
    const content = await readFile(markdownCopy, 'utf-8')
    expect(content).toContain('Getting Started')
    expect(content).toContain('description: Walk through the minimal steps')
  })
})
