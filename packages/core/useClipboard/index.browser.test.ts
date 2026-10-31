import { useClipboard, usePermission } from '@vueuse/core'
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('useClipboard', () => {
  it('should be be supported', () => {
    const { isSupported } = useClipboard()
    expect(isSupported.value).toBe(true)
  })

  describe('without permissions', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should write to legacy clipboard', async () => {
      // Without a user gesture the browser refuses execCommand('copy'), so the test stands in for a copy that works.
      vi.spyOn(document, 'execCommand').mockReturnValue(true)
      const writePermission = usePermission('clipboard-write')
      expect(writePermission.value).toBe(undefined) // currently no permissions testing legacy fallback
      const { text, copy, copied } = useClipboard()
      expect(text.value).toBe('')
      expect(copied.value).toBe(false)
      await copy('hello')
      expect(text.value).toBe('hello')
      expect(copied.value).toBe(true)
    })

    it('should copy text from async function', async () => {
      vi.spyOn(document, 'execCommand').mockReturnValue(true)
      const { text, copy, copied, copyPending } = useClipboard()
      expect(text.value).toBe('')
      expect(copied.value).toBe(false)

      const promise = copy(async () => 'async text')
      expect(copyPending.value).toBe(true)

      await promise

      expect(text.value).toBe('async text')
      expect(copied.value).toBe(true)
    })

    it('should not set copied when the legacy copy fails', async () => {
      const execCommand = vi.spyOn(document, 'execCommand').mockReturnValue(false)
      const { copy, copied, error } = useClipboard()

      await copy('hello')

      expect(execCommand).toHaveBeenCalledWith('copy')
      expect(copied.value).toBe(false)
      expect(error.value).toBeInstanceOf(Error)

      execCommand.mockReturnValue(true)
      await copy('hello')

      expect(copied.value).toBe(true)
      expect(error.value).toBe(undefined)
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
