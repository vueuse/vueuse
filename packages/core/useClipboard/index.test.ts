import { useClipboard } from '@vueuse/core'
import { describe, expect, it } from 'vitest'

describe('useClipboard', () => {
  it('should be defined', () => {
    expect(useClipboard).toBeDefined()
  })

  it('should be supported', () => {
    const { isSupported } = useClipboard()
    expect(isSupported.value).toBe(true)
  })
})
