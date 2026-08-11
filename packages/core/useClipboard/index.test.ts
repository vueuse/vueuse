import { useClipboard, usePermission } from '@vueuse/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('useClipboard', () => {
  it('should be defined', () => {
    expect(useClipboard).toBeDefined()
  })

  describe('without ClipboardItem support', () => {
    const write = vi.fn()
    const writeText = vi.fn()

    beforeEach(() => {
      vi.stubGlobal('ClipboardItem', undefined)
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { write, writeText },
      })
      Object.defineProperty(navigator, 'permissions', {
        configurable: true,
        value: { query: async () => ({ state: 'granted', addEventListener: () => {}, removeEventListener: () => {} }) },
      })
    })

    afterEach(() => {
      vi.unstubAllGlobals()
      Reflect.deleteProperty(navigator, 'clipboard')
      Reflect.deleteProperty(navigator, 'permissions')
    })

    it('should copy text with writeText', async () => {
      const { text, copy, copied } = useClipboard()
      const writePermission = usePermission('clipboard-write')
      await vi.waitFor(() => expect(writePermission.value).toBe('granted'))

      await copy('hello')

      expect(write).not.toHaveBeenCalled()
      expect(writeText).toHaveBeenCalledWith('hello')
      expect(text.value).toBe('hello')
      expect(copied.value).toBe(true)
    })

    it('should copy text from async function with writeText', async () => {
      const { text, copy, copied } = useClipboard()
      const writePermission = usePermission('clipboard-write')
      await vi.waitFor(() => expect(writePermission.value).toBe('granted'))

      await copy(async () => 'async text')

      expect(write).not.toHaveBeenCalled()
      expect(writeText).toHaveBeenCalledWith('async text')
      expect(text.value).toBe('async text')
      expect(copied.value).toBe(true)
    })
  })
})
