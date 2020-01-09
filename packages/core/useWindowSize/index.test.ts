import { renderHook } from '../../_docs/tests'
import { useWindowSize } from '.'

describe('useWindowSize', () => {
  it('should be defined', () => {
    expect(useWindowSize).toBeDefined()
  })

  it('should work', () => {
    const wrapper = renderHook(() => {
      const { width, height } = useWindowSize(100, 200)

      expect(width.value).toBe(window.innerWidth)
      expect(height.value).toBe(window.innerHeight)

      return { width, height }
    })

    expect(wrapper.vm.width).toBe(window.innerWidth)
    expect(wrapper.vm.height).toBe(window.innerHeight)
  })

  it('sets handler for window "resize" event', () => {
    const windowAddEventListener = jest.spyOn(window, 'addEventListener');

    renderHook(() => {
      const { width, height } = useWindowSize(100, 200)
      return { width, height }
    })

    expect(windowAddEventListener).toHaveBeenCalledWith('resize', expect.anything(), undefined)
  })
})
