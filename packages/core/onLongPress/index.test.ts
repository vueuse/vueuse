import { promiseTimeout } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { onLongPress } from '.'

describe('onLongPress', () => {
  let element: Ref<HTMLElement>
  let parentElement: Ref<HTMLElement>
  let childElement: Ref<HTMLElement>
  let pointerdownEvent: PointerEvent
  let pointerUpEvent: PointerEvent

  async function triggerCallback(isRef: boolean) {
    const onLongPressCallback = vi.fn()
    onLongPress(isRef ? element : element.value, onLongPressCallback)
    element.value.dispatchEvent(pointerdownEvent)
    expect(onLongPressCallback).toHaveBeenCalledTimes(0)
    await promiseTimeout(500)
    expect(onLongPressCallback).toHaveBeenCalledTimes(1)
  }

  async function triggerCallbackWithDelay(isRef: boolean) {
    const onLongPressCallback = vi.fn()
    onLongPress(isRef ? element : element.value, onLongPressCallback, { delay: 1000 })
    // first pointer down
    element.value.dispatchEvent(pointerdownEvent)

    // wait for 500ms after pointer down
    await promiseTimeout(500)
    expect(onLongPressCallback).toHaveBeenCalledTimes(0)

    // pointer up to cancel callback
    element.value.dispatchEvent(pointerUpEvent)

    // wait for 500ms after pointer up
    await promiseTimeout(500)
    expect(onLongPressCallback).toHaveBeenCalledTimes(0)

    // another pointer down
    element.value.dispatchEvent(pointerdownEvent)

    // wait for 1000ms after pointer down
    await promiseTimeout(1000)
    expect(onLongPressCallback).toHaveBeenCalledTimes(1)
  }

  async function notTriggerCallbackOnChildLongPress(isRef: boolean) {
    const onLongPressCallback = vi.fn()
    onLongPress(isRef ? element : element.value, onLongPressCallback, { modifiers: { self: true } })

    childElement.value.dispatchEvent(pointerdownEvent)

    await promiseTimeout(500)

    expect(onLongPressCallback).toHaveBeenCalledTimes(0)
  }

  async function workOnceAndPreventModifiers(isRef: boolean) {
    const onLongPressCallback = vi.fn()
    onLongPress(isRef ? element : element.value, onLongPressCallback, { modifiers: { once: true, prevent: true } })

    element.value.dispatchEvent(pointerdownEvent)

    await promiseTimeout(500)

    expect(onLongPressCallback).toHaveBeenCalledTimes(1)
    expect(pointerdownEvent.defaultPrevented).toBe(true)

    await promiseTimeout(500)

    expect(onLongPressCallback).toHaveBeenCalledTimes(1)
  }

  async function stopPropagation(isRef: boolean) {
    const onLongPressCallback = vi.fn()
    const onParentLongPressCallback = vi.fn()
    useEventListener(parentElement, 'pointerdown', onParentLongPressCallback)
    onLongPress(isRef ? element : element.value, onLongPressCallback, { modifiers: { stop: true } })

    element.value.dispatchEvent(pointerdownEvent)

    await promiseTimeout(500)

    expect(onLongPressCallback).toHaveBeenCalledTimes(1)
    expect(onParentLongPressCallback).toHaveBeenCalledTimes(0)
  }

  function suites(isRef: boolean) {
    describe('given no options', () => {
      it('should trigger longpress after 500ms', () => triggerCallback(isRef))
    })

    describe('given options', () => {
      it('should trigger longpress after options.delay ms', () => triggerCallbackWithDelay(isRef))
      it('should not tirgger longpress when child element on longpress', () => notTriggerCallbackOnChildLongPress(isRef))
      it('should work with once and prevent modifiers', () => workOnceAndPreventModifiers(isRef))
      it('should stop propagation', () => stopPropagation(isRef))
    })
  }

  beforeEach(() => {
    element = ref(document.createElement('div'))
    parentElement = ref(document.createElement('div'))
    childElement = ref(document.createElement('div'))
    parentElement.value.appendChild(element.value)
    element.value.appendChild(childElement.value)

    pointerdownEvent = new PointerEvent('pointerdown', { cancelable: true, bubbles: true })
    pointerUpEvent = new PointerEvent('pointerup', { cancelable: true, bubbles: true })
  })

  it('should be defined', () => {
    expect(onLongPress).toBeDefined()
  })

  describe('given argument is ref', () => suites(true))

  describe('given argument is no ref', () => suites(false))
})
