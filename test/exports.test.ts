import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { checkBuildState } from 'tsdown-stale-guard'
import { describePackagesApiSnapshots } from 'tsnapi/vitest'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')

describePackagesApiSnapshots({
  cwd: root,
  beforeEach: async (ctx) => {
    const result = await checkBuildState({ root: ctx.packageRoot })
    if (!result.fresh) {
      throw new Error('Build is not fresh, run `pnpm build` to fix it')
    }
  },
})

describe('build output', () => {
  it('does not emit Rollup-invalid pure annotations in core output', async () => {
    const result = await checkBuildState({ root: resolve(root, 'packages/core') })
    if (!result.fresh)
      throw new Error('Build is not fresh, run `pnpm build` to fix it')

    const index = readFileSync(resolve(root, 'packages/core/dist/index.js'), 'utf-8')
    expect(index).not.toMatch(/\/\* #__PURE__ \*\/\s*const events/)
    expect(index).not.toContain('(/* #__PURE__ */ {')
  })
})
