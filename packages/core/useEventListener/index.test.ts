import type { Fn } from '@vueuse/shared'
import type { Mock, SpyInstance } from 'vitest'
import { useEventListener } from '.'

describe('useEventListener', () => {
  describe('given both none array', () => {
    let target: HTMLDivElement
    let stop: Fn
    let listener: Mock
    let remove: SpyInstance
    const event = 'click'

    beforeEach(() => {
      target = document.createElement('div')
      listener = vi.fn()
      stop = useEventListener(target, event, listener)
      remove = vitest.spyOn(target, 'removeEventListener')
    })

    it('should trigger listener', () => {
      expect(listener).not.toBeCalled()
      target.dispatchEvent(new MouseEvent(event))
      expect(listener).toBeCalledTimes(1)
    })

    it('should remove listener', () => {
      expect(remove).not.toBeCalled()
      stop()
      expect(remove).toBeCalledTimes(1)
    })
  })

  describe('given array of events but single listener', () => {
    let target: HTMLDivElement
    let stop: Fn
    let listener: Mock
    let remove: SpyInstance
    const events = ['click', 'scroll', 'blur', 'resize']
    const options = { capture: false }

    beforeEach(() => {
      target = document.createElement('div')
      listener = vi.fn()
      stop = useEventListener(target, events, listener, options)
      remove = vitest.spyOn(target, 'removeEventListener')
    })

    it('should trigger listener with all events', () => {
      expect(listener).not.toBeCalled()
      events.forEach((event, index) => {
        target.dispatchEvent(new Event(event))
        expect(listener).toBeCalledTimes(index + 1)
      })
    })

    it('should remove listener with all events', () => {
      expect(remove).not.toBeCalled()

      stop()

      expect(remove).toBeCalledTimes(events.length)
      events.forEach(event => expect(remove).toBeCalledWith(event, listener, options))
    })
  })

  describe('given single event but array of listeners', () => {
    let target: HTMLDivElement
    let stop: Fn
    let listeners: Mock[]
    let remove: SpyInstance
    const event = 'click'
    const options = { capture: true }

    beforeEach(() => {
      target = document.createElement('div')
      listeners = [vi.fn(), vi.fn(), vi.fn()]
      stop = useEventListener(target, event, listeners, options)
      remove = vitest.spyOn(target, 'removeEventListener')
    })

    it('should call all listeners with single click event', () => {
      listeners.forEach(listener => expect(listener).not.toBeCalled())

      target.dispatchEvent(new Event(event))

      listeners.forEach(listener => expect(listener).toBeCalledTimes(1))
    })

    it('should remove listeners', () => {
      expect(remove).not.toBeCalled()

      stop()

      expect(remove).toBeCalledTimes(listeners.length)
      listeners.forEach(listener => expect(remove).toHaveBeenCalledWith(event, listener, options))
    })
  })

  describe('given both array of events and listeners', () => {
    let target: HTMLDivElement
    let stop: Fn
    let listeners: Mock[]
    let remove: SpyInstance
    const events = ['click', 'scroll', 'blur', 'resize']
    const options = { capture: true }

    beforeEach(() => {
      target = document.createElement('div')
      listeners = [vi.fn(), vi.fn(), vi.fn()]
      stop = useEventListener(target, events, listeners, options)
      remove = vitest.spyOn(target, 'removeEventListener')
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
          expect(remove).toBeCalledWith(event, listener, options)
        })
      })
    })
  })
})
