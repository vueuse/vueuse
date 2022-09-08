import type { Fn } from '@vueuse/shared'
import type { SpyInstance } from 'vitest'
import { useEventListener } from '.'

describe('useEventListener', () => {
  let target: HTMLDivElement
  let removeSpy: SpyInstance
  let addSpy: SpyInstance

  beforeEach(() => {
    target = document.createElement('div')
    removeSpy = vitest.spyOn(target, 'removeEventListener')
    addSpy = vitest.spyOn(target, 'addEventListener')
  })

  it('should be defined', () => {
    expect(useEventListener).toBeDefined()
  })

  describe('given both none array', () => {
    let stop: Fn
    const listener = vitest.fn()
    const event = 'click'

    beforeEach(() => {
      listener.mockReset()
      stop = useEventListener(target, event, listener)
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
    })
  })

  describe('given array of events but single listener', () => {
    let stop: Fn
    const listener = vitest.fn()
    const events = ['click', 'scroll', 'blur', 'resize']
    const options = { capture: false }

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
    let stop: Fn
    const listeners = [vitest.fn(), vitest.fn(), vitest.fn()]
    const event = 'click'
    const options = { capture: true }

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
      listeners.forEach(listener => expect(removeSpy).toHaveBeenCalledWith(event, listener, options))
    })
  })

  describe('given both array of events and listeners', () => {
    let stop: Fn
    const listeners = [vitest.fn(), vitest.fn(), vitest.fn()]
    const events = ['click', 'scroll', 'blur', 'resize']
    const options = { capture: true }

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
})
