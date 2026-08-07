import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useWindowSize } from './index'

describe('useWindowSize', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
  const matchMediaSpy = vi.spyOn(window, 'matchMedia')

  it('should be defined', () => {
    expect(useWindowSize).toBeDefined()
  })

  it('should work', () => {
    const { width, height } = useWindowSize({ initialWidth: 100, initialHeight: 200 })

    expect(width.value).toBe(window.innerWidth)
    expect(height.value).toBe(window.innerHeight)
  })

  it('should exclude scrollbar', () => {
    const { width, height } = useWindowSize({ initialWidth: 100, initialHeight: 200, includeScrollbar: false })

    expect(width.value).toBe(window.document.documentElement.clientWidth)
    expect(height.value).toBe(window.document.documentElement.clientHeight)
  })

  it('should use outer size', () => {
    const { width, height } = useWindowSize({ initialWidth: 100, initialHeight: 200, type: 'outer' })

    expect(width.value).toBe(window.outerWidth)
    expect(height.value).toBe(window.outerHeight)
  })

  it('sets handler for window "resize" event', async () => {
    useWindowSize({ initialWidth: 100, initialHeight: 200, listenOrientation: false })

    await nextTick()

    expect(addEventListenerSpy).toHaveBeenCalledExactlyOnceWith(
      'resize',
      expect.any(Function),
      { passive: true },
    )
  })

  it('sets handler for window.matchMedia("(orientation: portrait)") change event', async () => {
    useWindowSize({ initialWidth: 100, initialHeight: 200 })

    await nextTick()

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)

    expect(matchMediaSpy).toHaveBeenCalledExactlyOnceWith('(orientation: portrait)')
  })
})
