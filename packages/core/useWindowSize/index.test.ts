import { nextTick } from 'vue-demi'
import { useWindowSize } from '.'

describe('useWindowSize', () => {
  it('should be defined', () => {
    expect(useWindowSize).toBeDefined()
  })

  it('should work', () => {
    const { width, height } = useWindowSize({ initialWidth: 100, initialHeight: 200 })

    expect(width.value).toBe(window.innerWidth)
    expect(height.value).toBe(window.innerHeight)
  })

  it('sets handler for window "resize" event', async() => {
    const fn = vitest.fn()
    const old = window.addEventListener
    window.addEventListener = fn

    useWindowSize({ initialWidth: 100, initialHeight: 200 })

    await nextTick()

    expect(fn).toBeCalled()
    expect(fn.calls.at(-1)![0]).toEqual('resize')
    expect(fn.calls.at(-1)![2]).toEqual({ passive: true })

    window.addEventListener = old
  })
})
