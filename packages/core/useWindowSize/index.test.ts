import { useWindowSize } from '.'

describe('useWindowSize', () => {
  const addEventListenerSpy = vitest.spyOn(window, 'addEventListener')

  beforeEach(() => {
    addEventListenerSpy.mockReset()
  })

  it('should be defined', () => {
    expect(useWindowSize).toBeDefined()
  })

  it('should work', () => {
    const { width, height } = useWindowSize({ initialWidth: 100, initialHeight: 200 })

    expect(width.value).toBe(window.innerWidth)
    expect(height.value).toBe(window.innerHeight)
  })

  it('sets handler for window "resize" event', async() => {
    useWindowSize({ initialWidth: 100, initialHeight: 200 })

    const call = addEventListenerSpy.mock.calls.at(-1) as any
    expect(call[0]).toEqual('resize')
    expect(call[2]).toEqual({ passive: true })
  })
})
