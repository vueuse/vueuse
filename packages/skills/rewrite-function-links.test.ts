import { describe, expect, it } from 'vitest'
import { rewriteFunctionLinks } from './rewrite-function-links'

describe('rewriteFunctionLinks', () => {
  it('rewrites a plain function link', () => {
    expect(rewriteFunctionLinks('[useMouse](../useMouse/index.md)', './')).toBe('[useMouse](./useMouse.md)')
  })

  it('preserves an anchor on the link', () => {
    expect(rewriteFunctionLinks('[useMouse](../useMouse/index.md#options)', 'references/')).toBe('[useMouse](references/useMouse.md#options)')
  })

  it('leaves unrelated links untouched', () => {
    expect(rewriteFunctionLinks('[Vue](https://vuejs.org)', './')).toBe('[Vue](https://vuejs.org)')
  })
})
