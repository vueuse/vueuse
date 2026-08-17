import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { useResizeObserver } from './index'

describe('useResizeObserver', () => {
  it('should not throw when target resolves to a Comment node', () => {
    // During SSR/hydration mismatches, Vue can mount a component onto a Comment
    // node instead of an Element. The previous `if (_el)` truthy check passed for
    // Comment nodes (they are non-null objects), causing ResizeObserver.observe()
    // to throw "parameter 1 is not of type 'Element'". The fix guards with
    // `instanceof Element` so non-Element nodes are silently skipped.
    const comment = document.createComment('ssr-placeholder')
    const el = ref(comment as unknown as HTMLElement)
    expect(() => useResizeObserver(el, () => {})).not.toThrow()
  })

  it('should not throw when target is null', () => {
    const el = ref<HTMLElement | null>(null)
    expect(() => useResizeObserver(el, () => {})).not.toThrow()
  })
})
