import { useClipboard, usePermission } from '@vueuse/core'
import { describe, expect, it } from 'vitest'

describe('useClipboard', () => {
  it('should be be supported', () => {
    const { isSupported } = useClipboard()
    expect(isSupported.value).toBe(true)
  })

  describe('without permissions', () => {
    it('should write to legacy clipboard', async () => {
      const writePermission = usePermission('clipboard-write')
      expect(writePermission.value).toBe(undefined) // currently no permissions testing legacy fallback
      const { text, copy, copied } = useClipboard()
      expect(text.value).toBe('')
      expect(copied.value).toBe(false)
      await copy('hello')
      expect(text.value).toBe('hello')
      expect(copied.value).toBe(true)
    })

    it.todo('should read from legacy clipboard')
  })

  describe('with permissions', () => {
    // todo: mock navigator permissions
    it.todo('should write to clipboard')

    it.todo('should read from clipboard')

    it.todo('should fall back to legacy clipboard if write fails')

    it.todo('should fall back to legacy clipboard if read fails')
  })
})
