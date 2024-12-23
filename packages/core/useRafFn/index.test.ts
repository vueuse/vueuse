import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useRafFn } from '.'

describe('useRafFn', () => {
  it('should be defined', () => {
    expect(useRafFn).toBeDefined()
  })

  it('should call the passed function', async () => {
    const fn = vi.fn()
    useRafFn(fn)
    await vi.waitFor(() => {
      expect(fn).toHaveBeenCalled()
    })
  })

  it('should immediately be active', async () => {
    const { isActive } = useRafFn(() => {})
    expect(isActive.value).toBe(true)
  })

  it('should not be immediately active with options.immediate=false', async () => {
    const { isActive } = useRafFn(() => {}, { immediate: false })
    expect(isActive.value).toBe(false)
  })

  it('should not be active after pause', async () => {
    const { isActive, pause } = useRafFn(() => {})
    expect(isActive.value).toBe(true)
    pause()
    expect(isActive.value).toBe(false)
  })

  it('should be active after resume', async () => {
    const { isActive, pause, resume } = useRafFn(() => {})
    expect(isActive.value).toBe(true)
    pause()
    expect(isActive.value).toBe(false)
    resume()
    expect(isActive.value).toBe(true)
  })

  it('should be active after resume and immediate false', async () => {
    const { isActive, resume } = useRafFn(() => {}, { immediate: false })
    expect(isActive.value).toBe(false)
    resume()
    expect(isActive.value).toBe(true)
  })

  it('should call the function with delta and timestamp', async () => {
    const fn = vi.fn()
    useRafFn(fn)
    await vi.waitFor(() => {
      expect(fn).toHaveBeenCalled()
    })
    expect(fn.mock.calls[0][0]?.delta).toBeDefined()
    expect(fn.mock.calls[0][0]?.timestamp).toBeDefined()
  })

  it('should apply a framerate', async () => {
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    useRafFn(fn1, { fpsLimit: 20 })
    useRafFn(fn2, { fpsLimit: 60 })
    await vi.waitFor(() => {
      expect(fn1).toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()
    })
    expect(fn1.mock.calls.length).toBeLessThan(fn2.mock.calls.length)
  })

  it('should handle a framerate change', async () => {
    const initialFramerate = 60
    const fr = ref(initialFramerate)
    const fn1 = vi.fn()
    const fn2 = vi.fn()
    useRafFn(fn1, { fpsLimit: fr })
    useRafFn(fn2, { fpsLimit: initialFramerate })
    await vi.waitFor(() => {
      expect(fn1).toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()
    })
    // potentially flaky ?
    expect(fn1.mock.calls.length).toBe(fn2.mock.calls.length)
    fr.value = 20
    vi.clearAllMocks()
    await vi.waitFor(() => {
      expect(fn1).toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()
    })
    expect(fn1.mock.calls.length).toBeLessThan(fn2.mock.calls.length)
  })
})
