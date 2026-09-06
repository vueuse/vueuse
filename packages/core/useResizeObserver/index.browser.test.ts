import { describe, expect, it } from 'vitest'
import { shallowRef } from 'vue'
import { useResizeObserver } from './index'

describe('useResizeObserver', () => {
  it('should not throw when target resolves to a Comment node', () => {
    const comment = document.createComment('ssr-placeholder')
    const el = shallowRef(comment as unknown as HTMLElement)
    expect(() => useResizeObserver(el, () => {})).not.toThrow()
  })

  it('should not throw when target is null', () => {
    const el = shallowRef<HTMLElement | null>(null)
    expect(() => useResizeObserver(el, () => {})).not.toThrow()
  })
})
