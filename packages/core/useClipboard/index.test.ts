import { useClipboard } from '@vueuse/core'
import { afterEach, describe, expect, it, vi } from 'vitest'

// jsdom does not implement document.execCommand, which the legacy copy path uses.
function mockExecCommand() {
  ;(document as unknown as { execCommand: typeof document.execCommand }).execCommand = vi.fn(() => true)
}

describe('useClipboard', () => {
  it('should be defined', () => {
    expect(useClipboard).toBeDefined()
  })

  afterEach(() => {
    delete (document as unknown as { execCommand?: unknown }).execCommand
  })

  // Regression tests for https://github.com/vueuse/vueuse/issues/5539
  // The async value provider must be resolved exactly once per copy() call so
  // that it is never re-invoked when the Clipboard API write fails and the
  // code falls back to the legacy copy path. (Full reproduction of the original
  // double-invocation requires a permission-granted browser environment, which
  // jsdom cannot simulate because the permission state is mount-gated.)
  it('should resolve an async value provider exactly once and copy the result (#5539)', async () => {
    mockExecCommand()
    const { copy, text, copied } = useClipboard({ legacy: true })

    const asyncCopy = vi.fn(() => Promise.resolve('hello'))
    await copy(asyncCopy)

    expect(asyncCopy).toHaveBeenCalledTimes(1)
    expect(text.value).toBe('hello')
    expect(copied.value).toBe(true)
  })

  it('should propagate a rejection from the async value provider without re-invoking it (#5539)', async () => {
    mockExecCommand()
    const { copy } = useClipboard({ legacy: true })

    const failedCopy = vi.fn(() => Promise.reject(new Error('nope')))
    await expect(copy(failedCopy)).rejects.toThrow('nope')
    expect(failedCopy).toHaveBeenCalledTimes(1)
  })

  it('should copy a plain string', async () => {
    mockExecCommand()
    const { copy, text, copied } = useClipboard({ legacy: true })

    await copy('hello')
    expect(text.value).toBe('hello')
    expect(copied.value).toBe(true)
  })
})
