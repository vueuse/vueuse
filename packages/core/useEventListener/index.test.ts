import { noop } from '@vueuse/shared'
import { isVue2 } from 'vue-demi'
import type { Ref } from 'vue'
import { effectScope, nextTick, ref } from 'vue'
import { useEventListener } from '.'

describe('useEventListener', () => {
  let target: Ref<HTMLDivElement | null>
  let listener: () => any

  beforeEach(() => {
    target = ref(document.createElement('div'))
    listener = vi.fn()
  })

  it('should not listen when target is invalid', async () => {
    useEventListener(target, 'click', listener)
    const el = target.value
    target.value = null
    await nextTick()
    el?.dispatchEvent(new MouseEvent('click'))
    await nextTick()

    expect(listener).toHaveBeenCalledTimes(isVue2 ? 1 : 0)
    expect(useEventListener(null, 'click', listener)).toBe(noop)
  })

  function getTargetName(useTarget: boolean) {
    return useTarget ? 'element' : 'window'
  }

  function getArgs(useTarget: boolean) {
    return (useTarget ? [target, 'click', listener] : ['click', listener])
  }

  function trigger(useTarget: boolean) {
    (useTarget ? target.value : window)!.dispatchEvent(new MouseEvent('click'))
  }

  function testTarget(useTarget: boolean) {
    it(`should ${getTargetName(useTarget)} listen event`, async () => {
      // @ts-expect-error mock different args
      const stop = useEventListener(...getArgs(useTarget))

      trigger(useTarget)

      await nextTick()

      expect(listener).toHaveBeenCalledTimes(1)
    })

    it(`should ${getTargetName(useTarget)} manually stop listening event`, async () => {
      // @ts-expect-error mock different args
      const stop = useEventListener(...getArgs(useTarget))

      stop()

      trigger(useTarget)

      await nextTick()

      expect(listener).toHaveBeenCalledTimes(0)
    })

    it(`should ${getTargetName(useTarget)} auto stop listening event`, async () => {
      const scope = effectScope()
      await scope.run(async () => {
        // @ts-expect-error mock different args
        useEventListener(...getArgs(useTarget))
      })

      await scope.stop()

      trigger(useTarget)

      await nextTick()

      expect(listener).toHaveBeenCalledTimes(isVue2 ? 1 : 0)
    })
  }

  testTarget(false)
  testTarget(true)
})
