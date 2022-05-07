import { nextTick } from 'vue'
import { useWindowSize } from '.'

describe('useWindowSize', () => {
  const addEventListenerSpy = vitest.spyOn(window, 'addEventListener')

  beforeEach(() => {
    addEventListenerSpy.mockReset()
  })

  afterAll(() => {
    addEventListenerSpy.mockRestore()
  })

  it('should be defined', () => {
    expect(useWindowSize).toBeDefined()
  })

  it('should work', () => {
    const { width, height } = useWindowSize({ initialWidth: 100, initialHeight: 200 })

    expect(width.value).toBe(window.innerWidth)
    expect(height.value).toBe(window.innerHeight)
  })

  it('sets handler for window "resize" event', async () => {
    useWindowSize({ initialWidth: 100, initialHeight: 200 })

    await nextTick()

    expect(addEventListenerSpy).toHaveBeenCalledOnce()

    const call = addEventListenerSpy.mock.calls[0] as any
    expect(call[0]).toEqual('resize')
    expect(call[2]).toEqual({ passive: true })
  })
})
