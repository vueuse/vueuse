import { describe, expect, it, vi } from 'vitest'
import { isReadonly, nextTick, shallowRef } from 'vue'
import { useWindowSize } from './index'

describe('useWindowSize', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
  const matchMediaSpy = vi.spyOn(window, 'matchMedia')

  it('should be defined', () => {
    expect(useWindowSize).toBeDefined()
  })

  it('should work', () => {
    const { width, height } = useWindowSize({ initials: { width: 100, height: 200 } })

    expect(width.value).toBe(window.innerWidth)
    expect(height.value).toBe(window.innerHeight)
  })

  it('should exclude scrollbar', () => {
    const { width, height } = useWindowSize({ initials: { width: 100, height: 200 }, includeScrollbar: false })

    expect(width.value).toBe(window.document.documentElement.clientWidth)
    expect(height.value).toBe(window.document.documentElement.clientHeight)
  })

  it('should use outer size', () => {
    const { width, height } = useWindowSize({ initials: { width: 100, height: 200 }, type: 'outer' })

    expect(width.value).toBe(window.outerWidth)
    expect(height.value).toBe(window.outerHeight)
  })

  it('sets handler for window "resize" event', async () => {
    useWindowSize({ initials: { width: 100, height: 200 }, listenOrientation: false })

    await nextTick()

    expect(addEventListenerSpy).toHaveBeenCalledExactlyOnceWith(
      'resize',
      expect.any(Function),
      { passive: true },
    )
  })

  it('sets handler for window.matchMedia("(orientation: portrait)") change event', async () => {
    useWindowSize({ initials: { width: 100, height: 200 } })

    await nextTick()

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)

    expect(matchMediaSpy).toHaveBeenCalledExactlyOnceWith('(orientation: portrait)')
  })

  it('should return readonly refs', () => {
    const { width, height } = useWindowSize()

    expect(isReadonly(width)).toBe(true)
    expect(isReadonly(height)).toBe(true)
  })

  describe('initials', () => {
    // `null` skips the `defaultWindow` fallback, so the initial values are never overwritten
    const noWindow = null as unknown as undefined

    it('should default to infinity without a window', () => {
      const { width, height } = useWindowSize({ window: noWindow })

      expect(width.value).toBe(Number.POSITIVE_INFINITY)
      expect(height.value).toBe(Number.POSITIVE_INFINITY)
    })

    it('should seed from plain values', () => {
      const { width, height } = useWindowSize({ window: noWindow, initials: { width: 100, height: 200 } })

      expect(width.value).toBe(100)
      expect(height.value).toBe(200)
    })

    it('should use passed refs as internal state', () => {
      const width = shallowRef(1280)
      const height = shallowRef(720)

      const size = useWindowSize({ initials: { width, height } })

      expect(size.width).not.toBe(width)
      expect(width.value).toBe(window.innerWidth)
      expect(height.value).toBe(window.innerHeight)

      width.value = 1024
      expect(size.width.value).toBe(1024)
    })

    it('should support deprecated initialWidth / initialHeight', () => {
      const { width, height } = useWindowSize({ window: noWindow, initialWidth: 100, initialHeight: 200 })

      expect(width.value).toBe(100)
      expect(height.value).toBe(200)
    })

    it('should prefer initials over deprecated options', () => {
      const { width, height } = useWindowSize({
        window: noWindow,
        initialWidth: 1,
        initialHeight: 2,
        initials: { width: 100 },
      })

      expect(width.value).toBe(100)
      expect(height.value).toBe(2)
    })
  })
})
