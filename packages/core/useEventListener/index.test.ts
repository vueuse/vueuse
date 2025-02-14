import type { Fn } from '@vueuse/shared'
import type { MockInstance } from 'vitest'
import type { Ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, effectScope, nextTick, ref, shallowRef } from 'vue'
import { useEventListener } from './index'

describe('useEventListener', () => {
  const options = { capture: true }
  let stop: Fn
  let target: HTMLDivElement
  let removeSpy: MockInstance
  let addSpy: MockInstance

  beforeEach(() => {
    target = document.createElement('div')
    removeSpy = vi.spyOn(target, 'removeEventListener')
    addSpy = vi.spyOn(target, 'addEventListener')
  })

  it('should be defined', () => {
    expect(useEventListener).toBeDefined()
  })

  describe('given both none array', () => {
    const listener = vi.fn()
    const event = 'click'

    beforeEach(() => {
      listener.mockReset()
      stop = useEventListener(target, event, listener, options)
    })

    it('should add listener', () => {
      expect(addSpy).toBeCalledTimes(1)
    })

    it('should trigger listener', () => {
      expect(listener).not.toBeCalled()
      target.dispatchEvent(new MouseEvent(event))
      expect(listener).toBeCalledTimes(1)
    })

    it('should remove listener', () => {
      expect(removeSpy).not.toBeCalled()

      stop()

      expect(removeSpy).toBeCalledTimes(1)
      expect(removeSpy).toBeCalledWith(event, listener, options)
    })
  })

  describe('given array of events but single listener', () => {
    const listener = vi.fn()
    const events = ['click', 'scroll', 'blur', 'resize']

    beforeEach(() => {
      listener.mockReset()
      stop = useEventListener(target, events, listener, options)
    })

    it('should add listener for all events', () => {
      events.forEach(event => expect(addSpy).toBeCalledWith(event, listener, options))
    })

    it('should trigger listener with all events', () => {
      expect(listener).not.toBeCalled()
      events.forEach((event, index) => {
        target.dispatchEvent(new Event(event))
        expect(listener).toBeCalledTimes(index + 1)
      })
    })

    it('should remove listener with all events', () => {
      expect(removeSpy).not.toBeCalled()

      stop()

      expect(removeSpy).toBeCalledTimes(events.length)
      events.forEach(event => expect(removeSpy).toBeCalledWith(event, listener, options))
    })
  })

  describe('given single event but array of listeners', () => {
    const listeners = [vi.fn(), vi.fn(), vi.fn()]
    const event = 'click'

    beforeEach(() => {
      listeners.forEach(listener => listener.mockReset())
      stop = useEventListener(target, event, listeners, options)
    })

    it('should add all listeners', () => {
      listeners.forEach(listener => expect(addSpy).toBeCalledWith(event, listener, options))
    })

    it('should call all listeners with single click event', () => {
      listeners.forEach(listener => expect(listener).not.toBeCalled())

      target.dispatchEvent(new Event(event))

      listeners.forEach(listener => expect(listener).toBeCalledTimes(1))
    })

    it('should remove listeners', () => {
      expect(removeSpy).not.toBeCalled()

      stop()

      expect(removeSpy).toBeCalledTimes(listeners.length)
      listeners.forEach(listener => expect(removeSpy).toBeCalledWith(event, listener, options))
    })
  })

  describe('given both array of events and listeners', () => {
    const listeners = [vi.fn(), vi.fn(), vi.fn()]
    const events = ['click', 'scroll', 'blur', 'resize', 'custom-event']

    beforeEach(() => {
      listeners.forEach(listener => listener.mockReset())
      stop = useEventListener(target, events, listeners, options)
    })

    it('should add all listeners for all events', () => {
      listeners.forEach((listener) => {
        events.forEach((event) => {
          expect(addSpy).toBeCalledWith(event, listener, options)
        })
      })
    })

    it('should call all listeners with all events', () => {
      events.forEach((event, index) => {
        target.dispatchEvent(new Event(event))
        listeners.forEach(listener => expect(listener).toBeCalledTimes(index + 1))
      })
    })

    it('should remove all listeners with all events', () => {
      stop()

      listeners.forEach((listener) => {
        events.forEach((event) => {
          expect(removeSpy).toBeCalledWith(event, listener, options)
        })
      })
    })
  })

  describe('multiple events', () => {
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

      expect(listener).toHaveBeenCalledTimes(0)
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
        scope.run(async () => {
        // @ts-expect-error mock different args
          useEventListener(...getArgs(useTarget))
        })

        scope.stop()

        trigger(useTarget)

        await nextTick()

        expect(listener).toHaveBeenCalledTimes(0)
      })
    }

    testTarget(false)
    testTarget(true)
  })

  describe('useEventListener - multiple targets', () => {
    it('should accept an array ref of DOM elements', async () => {
      const listener = vi.fn()
      const el1 = document.createElement('button')
      const el2 = document.createElement('button')
      const arrayRef = computed(() => [el1, el2])

      useEventListener(arrayRef, 'click', listener)
      await nextTick()

      el1.dispatchEvent(new Event('click'))
      el2.dispatchEvent(new Event('click'))
      expect(listener).toHaveBeenCalledTimes(2)
    })

    it('should accept a getter returning multiple targets', async () => {
      const listener = vi.fn()
      const el1 = document.createElement('div')
      const el2 = document.createElement('div')
      const active = shallowRef(true)

      useEventListener(() => active.value ? [el1, el2] : [], 'mousedown', listener)
      await nextTick()

      el1.dispatchEvent(new Event('mousedown'))
      el2.dispatchEvent(new Event('mousedown'))
      expect(listener).toHaveBeenCalledTimes(2)

      // disable
      active.value = false
      await nextTick()
      el1.dispatchEvent(new Event('mousedown'))
      el2.dispatchEvent(new Event('mousedown'))
      // events should no longer trigger
      expect(listener).toHaveBeenCalledTimes(2)
    })

    it('should accept an array of DOM elements + multiple events', async () => {
      const listener = vi.fn()
      const el1 = document.createElement('button')
      const el2 = document.createElement('button')
      const arrayRef = computed(() => [el1, el2])

      useEventListener(arrayRef, ['click', 'hover'], listener)
      await nextTick()

      el1.dispatchEvent(new Event('click'))
      el2.dispatchEvent(new Event('click'))
      el1.dispatchEvent(new Event('hover'))
      el2.dispatchEvent(new Event('hover'))
      expect(listener).toHaveBeenCalledTimes(4)
    })

    it('should accept a getter returning multiple targets + multiple events', async () => {
      const listener = vi.fn()
      const el1 = document.createElement('div')
      const el2 = document.createElement('div')
      const active = shallowRef(true)

      useEventListener(() => active.value ? [el1, el2] : [], ['mousedown', 'click'], listener)
      await nextTick()

      el1.dispatchEvent(new Event('mousedown'))
      el2.dispatchEvent(new Event('mousedown'))
      el1.dispatchEvent(new Event('click'))
      el2.dispatchEvent(new Event('click'))
      expect(listener).toHaveBeenCalledTimes(4)

      // disable
      active.value = false
      await nextTick()
      el1.dispatchEvent(new Event('mousedown'))
      el2.dispatchEvent(new Event('mousedown'))
      el1.dispatchEvent(new Event('click'))
      el2.dispatchEvent(new Event('click'))
      // events should no longer trigger
      expect(listener).toHaveBeenCalledTimes(4)
    })

    it('should react to target + event + function changes properly', async () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()
      const el1 = document.createElement('div')
      const el2 = document.createElement('div')
      const els = ref([el1])
      const events = ref(['click'])
      const listeners = ref([listener1])

      useEventListener(els, events, listeners)
      el1.dispatchEvent(new Event('click'))
      els.value = [el2]
      await nextTick()
      el1.dispatchEvent(new Event('click'))
      el2.dispatchEvent(new Event('click'))
      events.value = ['mousedown']
      await nextTick()
      el1.dispatchEvent(new Event('click'))
      el2.dispatchEvent(new Event('click'))
      el2.dispatchEvent(new Event('mousedown'))
      els.value = [el1, el2]
      events.value = ['click', 'mousedown']
      listeners.value = [listener1, listener2]
      await nextTick()
      el1.dispatchEvent(new Event('click'))
      el2.dispatchEvent(new Event('click'))
      el1.dispatchEvent(new Event('mousedown'))
      el2.dispatchEvent(new Event('mousedown'))

      expect(listener1).toHaveBeenCalledTimes(7)
      expect(listener2).toHaveBeenCalledTimes(4)
    })
  })

  it('should auto re-register', async () => {
    const target = ref()
    const listener = vi.fn()
    const options = ref<any>(false)
    useEventListener(target, 'click', listener, options)

    const el = document.createElement('div')
    const addSpy = vi.spyOn(el, 'addEventListener')
    const removeSpy = vi.spyOn(el, 'removeEventListener')
    target.value = el
    await nextTick()
    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenLastCalledWith('click', listener, false)
    expect(removeSpy).toHaveBeenCalledTimes(0)

    options.value = true
    await nextTick()
    expect(addSpy).toHaveBeenCalledTimes(2)
    expect(addSpy).toHaveBeenLastCalledWith('click', listener, true)
    expect(removeSpy).toHaveBeenCalledTimes(1)
  })
})
