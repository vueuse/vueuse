import { promiseTimeout } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { onLongPress } from '.'

describe('onLongPress', () => {
  let element: Ref<HTMLElement>
  let pointerdownEvent: PointerEvent

  beforeEach(() => {
    element = ref(document.createElement('div'))

    pointerdownEvent = new PointerEvent('pointerdown', { cancelable: true, bubbles: true })
  })

  it('should be defined', () => {
    expect(onLongPress).toBeDefined()
  })

  describe('given argument is ref', () => {
    describe('given no options', () => {
      it('should trigger longpress after 500ms', async () => {
        const onLongPressCallback = vi.fn()
        onLongPress(element, onLongPressCallback)
        element.value.dispatchEvent(pointerdownEvent)
        expect(onLongPressCallback).toHaveBeenCalledTimes(0)
        await promiseTimeout(500)
        expect(onLongPressCallback).toHaveBeenCalledTimes(1)
      })
    })

    describe('given options', () => {
      it('should trigger longpress after options.delay ms', async () => {
        const onLongPressCallback = vi.fn()
        onLongPress(element, onLongPressCallback, { delay: 1000 })
        element.value.dispatchEvent(pointerdownEvent)
        await promiseTimeout(500)
        expect(onLongPressCallback).toHaveBeenCalledTimes(0)
        await promiseTimeout(500)
        expect(onLongPressCallback).toHaveBeenCalledTimes(1)
      })

      it('should work with once and prevent modefiers', async () => {
        const onLongPressCallback = vi.fn()
        onLongPress(element, onLongPressCallback, { modifiers: { once: true, prevent: true } })

        element.value.dispatchEvent(pointerdownEvent)

        await promiseTimeout(500)

        expect(onLongPressCallback).toHaveBeenCalledTimes(1)
        expect(pointerdownEvent.defaultPrevented).toBe(true)

        await promiseTimeout(500)

        expect(onLongPressCallback).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('given argument is no ref', () => {
    describe('given no options', () => {
      it('should trigger longpress after 500ms', async () => {
        const onLongPressCallback = vi.fn()
        onLongPress(element.value, onLongPressCallback)
        element.value.dispatchEvent(pointerdownEvent)
        expect(onLongPressCallback).toHaveBeenCalledTimes(0)
        await promiseTimeout(500)
        expect(onLongPressCallback).toHaveBeenCalledTimes(1)
      })
    })

    describe('given options', () => {
      it('should trigger longpress after options.delay ms', async () => {
        const onLongPressCallback = vi.fn()
        onLongPress(element.value, onLongPressCallback, { delay: 1000 })
        element.value.dispatchEvent(pointerdownEvent)
        await promiseTimeout(500)
        expect(onLongPressCallback).toHaveBeenCalledTimes(0)
        await promiseTimeout(500)
        expect(onLongPressCallback).toHaveBeenCalledTimes(1)
      })

      it('should work with once and prevent modefiers', async () => {
        const onLongPressCallback = vi.fn()
        onLongPress(element.value, onLongPressCallback, { modifiers: { once: true, prevent: true } })

        element.value.dispatchEvent(pointerdownEvent)

        await promiseTimeout(500)

        expect(onLongPressCallback).toHaveBeenCalledTimes(1)
        expect(pointerdownEvent.defaultPrevented).toBe(true)

        await promiseTimeout(500)

        expect(onLongPressCallback).toHaveBeenCalledTimes(1)
      })
    })
  })
})
