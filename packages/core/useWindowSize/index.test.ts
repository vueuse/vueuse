import { nextTick } from 'vue-demi'
// @ts-ignore
import { retry } from '../../.test/test.setup'
import { useWindowSize } from '.'

describe('useWindowSize', () => {
  let addEventListenerSpy
  beforeEach(() => {
    addEventListenerSpy = vitest.spyOn(window, 'addEventListener')
  })
  // it('should be defined', () => {
  //   expect(useWindowSize).toBeDefined()
  // })

  // it('should work', () => {
  //   const { width, height } = useWindowSize({ initialWidth: 100, initialHeight: 200 })

  //   expect(width.value).toBe(window.innerWidth)
  //   expect(height.value).toBe(window.innerHeight)
  // })

  it('sets handler for window "resize" event', async() => {
    useWindowSize({ initialWidth: 100, initialHeight: 200 })

    await retry(() => {
      console.log('calls', addEventListenerSpy.mock.calls)
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function), { passive: true })
    })
  })
})
