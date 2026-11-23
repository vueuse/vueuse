import { useClipboard } from '@vueuse/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

describe('useClipboard', () => {
  it('should be defined', () => {
    expect(useClipboard).toBeDefined()
  })

  describe('without ClipboardItem support', () => {
    const writeText = vi.fn(() => Promise.resolve())
    const write = vi.fn(() => Promise.resolve())
    const execCommand = vi.fn(() => true)

    beforeEach(() => {
      vi.stubGlobal('ClipboardItem', undefined)
      document.execCommand = execCommand
      Object.defineProperty(window.navigator, 'clipboard', {
        value: { write, writeText, readText: () => Promise.resolve('') },
        configurable: true,
      })
      Object.defineProperty(window.navigator, 'permissions', {
        value: { query: () => Promise.resolve({ state: 'granted', addEventListener: () => {} }) },
        configurable: true,
      })
    })

    afterEach(() => {
      vi.unstubAllGlobals()
      writeText.mockClear()
      write.mockClear()
      execCommand.mockClear()
      delete (document as any).execCommand
      delete (window.navigator as any).clipboard
      delete (window.navigator as any).permissions
    })

    it('should copy a string with writeText', async () => {
      const { copy, text, copied } = useClipboard()
      await nextTick()

      await copy('hello')

      expect(write).not.toHaveBeenCalled()
      expect(execCommand).not.toHaveBeenCalled()
      expect(writeText).toHaveBeenCalledWith('hello')
      expect(text.value).toBe('hello')
      expect(copied.value).toBe(true)
    })

    it('should copy the result of an async function with writeText', async () => {
      const { copy, text, copied } = useClipboard()
      await nextTick()

      const value = vi.fn(() => Promise.resolve('async text'))
      await copy(value)

      expect(value).toHaveBeenCalledTimes(1)
      expect(write).not.toHaveBeenCalled()
      expect(execCommand).not.toHaveBeenCalled()
      expect(writeText).toHaveBeenCalledWith('async text')
      expect(text.value).toBe('async text')
      expect(copied.value).toBe(true)
    })
  })
})
