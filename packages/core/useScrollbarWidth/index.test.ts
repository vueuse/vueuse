import { describe, expect, it } from 'vitest'
import { isShallow, shallowRef } from 'vue'
import { useScrollbarWidth } from './index'

// jsdom doesn't fire ResizeObserver callbacks, so dynamic resize behavior
// is intentionally not exercised here. A browser test (`index.browser.test.ts`)
// can be added if maintainers want runtime coverage of the observer wiring.

describe('useScrollbarWidth', () => {
  it('should be defined', () => {
    expect(useScrollbarWidth).toBeDefined()
  })

  it('returns a shallowRef initialized to 0', () => {
    const target = shallowRef<HTMLElement | null>(null)
    const width = useScrollbarWidth(target)
    expect(isShallow(width)).toBe(true)
    expect(width.value).toBe(0)
  })

  it('keeps 0 when target is null', () => {
    const target = shallowRef<HTMLElement | null>(null)
    const width = useScrollbarWidth(target)
    expect(width.value).toBe(0)
  })
})
