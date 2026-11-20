import { resolve } from 'node:path'
import { checkBuildState } from 'tsdown-stale-guard'
import { describePackagesApiSnapshots } from 'tsnapi/vitest'
import ts from 'typescript'
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

describe('core declarations', () => {
  it.each([
    ['without ambient Temporal', ['lib.es2024.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts']],
    ['with ambient Temporal', ['lib.es2024.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts', 'lib.esnext.temporal.d.ts']],
  ])('type-check %s', (_name, lib) => {
    const program = ts.createProgram([resolve(root, 'packages/core/dist/index.d.ts')], {
      lib,
      types: ['web-bluetooth'],
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      strict: true,
      skipLibCheck: false,
      noEmit: true,
    })
    const diagnostics = ts.getPreEmitDiagnostics(program)
      .map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))

    expect(diagnostics).toEqual([])
  })
})
