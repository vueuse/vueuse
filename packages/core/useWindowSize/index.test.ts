import { nextTick } from 'vue'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useWindowSize } from '.'

describe('useWindowSize', () => {
  const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
  const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  beforeEach(() => {
    addEventListenerSpy.mockClear()
    matchMediaSpy.mockClear()
  })

  afterAll(() => {
    addEventListenerSpy.mockRestore()
    matchMediaSpy.mockRestore()
  })

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

  it('sets handler for window "resize" event', async () => {
    useWindowSize({ initialWidth: 100, initialHeight: 200, listenOrientation: false })

    await nextTick()

    expect(addEventListenerSpy).toHaveBeenCalledOnce()

    const call = addEventListenerSpy.mock.calls[0] as any
    expect(call[0]).toEqual('resize')
    expect(call[2]).toEqual({ passive: true })
  })

  it('sets handler for window.matchMedia("(orientation: portrait)") change event', async () => {
    useWindowSize({ initialWidth: 100, initialHeight: 200 })

    await nextTick()

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1)

    expect(matchMediaSpy).toHaveBeenCalledTimes(1)
    const call = matchMediaSpy.mock.calls[0] as any
    expect(call[0]).toEqual('(orientation: portrait)')
  })
})
