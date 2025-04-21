import { describe, expect, it } from 'vitest'
import { defaultDocument } from '../_configurable'
import { useScrollParent } from './index'

describe('useScroll', () => {
  it('should be defined', () => {
    expect(useScrollParent).toBeDefined()
  })

  it('should have default parent', async () => {
    const scrollParent = useScrollParent(document)
    expect(scrollParent.value).toBe(defaultDocument)
  })
})
