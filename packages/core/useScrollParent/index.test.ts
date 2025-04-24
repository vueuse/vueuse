import { describe, expect, it } from 'vitest'
import { defaultDocument } from '../_configurable'
import { useScrollParent } from './index'

describe('useScroll', () => {
  it('should be defined', () => {
    expect(useScrollParent).toBeDefined()
  })

  it('should have fallback parent', async () => {
    const scrollParent = useScrollParent(document.scrollingElement || document.documentElement)
    expect(scrollParent.value).toBe(defaultDocument)
  })
})
