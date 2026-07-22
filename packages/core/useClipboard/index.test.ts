import type { ConfigurableNavigator } from '../_configurable'
import { useClipboard } from '@vueuse/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// jsdom does not implement document.execCommand, which the legacy copy path uses.
function mockExecCommand() {
  ;(document as unknown as { execCommand: typeof document.execCommand }).execCommand = vi.fn(() => true)
}

// Minimal ClipboardItem stand-in: jsdom does not provide one, and the Clipboard
// API path constructs it with a promise resolving to the copied Blob.
class MockClipboardItem {
  constructor(public readonly data: Record<string, Promise<Blob> | Blob | string>) {}
}

interface MockNavigatorOptions {
  // Reject clipboard.write independently of the value provider (a genuine
  // Clipboard API failure), instead of awaiting the item data.
  writeRejects?: boolean
}

// Builds a navigator with granted clipboard permission and an observable
// clipboard.write so we can drive the Clipboard API path and its fallback.
function createClipboardNavigator({ writeRejects = false }: MockNavigatorOptions = {}) {
  const write = vi.fn(async (items: MockClipboardItem[]) => {
    if (writeRejects)
      throw new Error('clipboard blocked')
    // Awaiting the item data mirrors the real API: a rejected value provider
    // makes the write reject.
    await Promise.all(items.flatMap(item => Object.values(item.data)))
  })

  const navigator = {
    clipboard: { write, readText: async () => '' },
    permissions: {
      query: async () => ({
        state: 'granted' as PermissionState,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    },
  }

  return { navigator: navigator as unknown as ConfigurableNavigator['navigator'], write }
}

// Lets usePermission's async query settle so the Clipboard API path is enabled.
function flushAsync() {
  return new Promise(resolve => setTimeout(resolve))
}

describe('useClipboard', () => {
  beforeEach(() => {
    vi.stubGlobal('ClipboardItem', MockClipboardItem)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    delete (document as unknown as { execCommand?: unknown }).execCommand
  })

  it('should be defined', () => {
    expect(useClipboard).toBeDefined()
  })

  // Regression tests for https://github.com/vueuse/vueuse/issues/5539
  // The async value provider must be resolved exactly once per copy() call so
  // that it is never re-invoked when the code falls back to the legacy copy
  // path after a Clipboard API failure.
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

  // The originally reported path: the Clipboard API is used, the write fails,
  // and the code falls back to the legacy path. The value provider must be
  // reused rather than invoked a second time.
  it('should reuse the resolved value for the legacy fallback when the Clipboard API write fails (#5539)', async () => {
    mockExecCommand()
    const { navigator, write } = createClipboardNavigator({ writeRejects: true })
    const { copy, text, copied } = useClipboard({ navigator })
    await flushAsync()

    const asyncCopy = vi.fn(() => Promise.resolve('hello'))
    await copy(asyncCopy)

    expect(write).toHaveBeenCalledTimes(1)
    expect(asyncCopy).toHaveBeenCalledTimes(1)
    expect(document.execCommand).toHaveBeenCalledTimes(1)
    expect(text.value).toBe('hello')
    expect(copied.value).toBe(true)
  })

  it('should not fall back to legacy copy when the async value provider rejects on the Clipboard API path (#5539)', async () => {
    mockExecCommand()
    const { navigator, write } = createClipboardNavigator()
    const { copy, copied } = useClipboard({ navigator })
    await flushAsync()

    const failedCopy = vi.fn(() => Promise.reject(new Error('nope')))
    await expect(copy(failedCopy)).rejects.toThrow('nope')

    expect(write).toHaveBeenCalledTimes(1)
    expect(failedCopy).toHaveBeenCalledTimes(1)
    expect(document.execCommand).not.toHaveBeenCalled()
    expect(copied.value).toBe(false)
  })
})
