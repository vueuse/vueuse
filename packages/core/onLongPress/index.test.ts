import type { Ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { onLongPress } from '.'
import { useEventListener } from '../useEventListener'

describe('onLongPress', () => {
  let element: Ref<HTMLElement>
  let parentElement: Ref<HTMLElement>
  let childElement: Ref<HTMLElement>
  let pointerdownEvent: PointerEvent
  let pointerUpEvent: PointerEvent

  beforeEach(() => {
    vi.useFakeTimers()
  })

  async function triggerCallback(isRef: boolean) {
    const onLongPressCallback = vi.fn()
    onLongPress(isRef ? element : element.value, onLongPressCallback)
    element.value.dispatchEvent(pointerdownEvent)
    expect(onLongPressCallback).toHaveBeenCalledTimes(0)
    await vi.advanceTimersByTimeAsync(500)
    expect(onLongPressCallback).toHaveBeenCalledTimes(1)
  }

  async function triggerCallbackWithDelay(isRef: boolean) {
    const onLongPressCallback = vi.fn()
    onLongPress(isRef ? element : element.value, onLongPressCallback, { delay: 1000 })
    // first pointer down
    element.value.dispatchEvent(pointerdownEvent)

    // wait for 500ms after pointer down
    await vi.advanceTimersByTimeAsync(500)
    expect(onLongPressCallback).toHaveBeenCalledTimes(0)

    // pointer up to cancel callback
    element.value.dispatchEvent(pointerUpEvent)

    // wait for 500ms after pointer up
    await vi.advanceTimersByTimeAsync(500)
    expect(onLongPressCallback).toHaveBeenCalledTimes(0)

    // another pointer down
    element.value.dispatchEvent(pointerdownEvent)

    // wait for 1000ms after pointer down
    await vi.advanceTimersByTimeAsync(1000)
    expect(onLongPressCallback).toHaveBeenCalledTimes(1)
  }

  async function notTriggerCallbackOnChildLongPress(isRef: boolean) {
    const onLongPressCallback = vi.fn()
    onLongPress(isRef ? element : element.value, onLongPressCallback, { modifiers: { self: true } })

    childElement.value.dispatchEvent(pointerdownEvent)

    await vi.advanceTimersByTimeAsync(500)

    expect(onLongPressCallback).toHaveBeenCalledTimes(0)
  }

  async function workOnceAndPreventModifiers(isRef: boolean) {
    const onLongPressCallback = vi.fn()
    onLongPress(isRef ? element : element.value, onLongPressCallback, { modifiers: { once: true, prevent: true } })

    element.value.dispatchEvent(pointerdownEvent)

    await vi.advanceTimersByTimeAsync(500)

    expect(onLongPressCallback).toHaveBeenCalledTimes(1)
    expect(pointerdownEvent.defaultPrevented).toBe(true)

    await vi.advanceTimersByTimeAsync(500)

    expect(onLongPressCallback).toHaveBeenCalledTimes(1)
  }

  async function stopPropagation(isRef: boolean) {
    const onLongPressCallback = vi.fn()
    const onParentLongPressCallback = vi.fn()
    useEventListener(parentElement, 'pointerdown', onParentLongPressCallback)
    onLongPress(isRef ? element : element.value, onLongPressCallback, { modifiers: { stop: true } })

    element.value.dispatchEvent(pointerdownEvent)

    await vi.advanceTimersByTimeAsync(500)

    expect(onLongPressCallback).toHaveBeenCalledTimes(1)
    expect(onParentLongPressCallback).toHaveBeenCalledTimes(0)
  }

  async function stopEventListeners(isRef: boolean) {
    const onLongPressCallback = vi.fn()
    const stop = onLongPress(isRef ? element : element.value, onLongPressCallback, { modifiers: { stop: true } })

    // before calling stop, the callback should be called
    element.value.dispatchEvent(pointerdownEvent)

    await vi.advanceTimersByTimeAsync(500)

    expect(onLongPressCallback).toHaveBeenCalledTimes(1)

    stop()

    // before calling stop, the callback should no longer be called
    onLongPressCallback.mockClear()

    element.value.dispatchEvent(pointerdownEvent)

    await vi.advanceTimersByTimeAsync(500)

    expect(onLongPressCallback).toHaveBeenCalledTimes(0)
  }

  async function triggerCallbackWithThreshold(isRef: boolean) {
    const onLongPressCallback = vi.fn()
    pointerdownEvent = new PointerEvent('pointerdown', { cancelable: true, bubbles: true, clientX: 20, clientY: 20 })
    const moveWithinThresholdEvent = new PointerEvent('pointermove', { cancelable: true, bubbles: true, clientX: 17, clientY: 25 })
    const moveOutsideThresholdEvent = new PointerEvent('pointermove', { cancelable: true, bubbles: true, clientX: 4, clientY: 30 })
    onLongPress(isRef ? element : element.value, onLongPressCallback, { distanceThreshold: 15, delay: 1000 })
    // first pointer down
    element.value.dispatchEvent(pointerdownEvent)

    // pointer move outside threshold
    await vi.advanceTimersByTimeAsync(500)
    element.value.dispatchEvent(moveOutsideThresholdEvent)
    await vi.advanceTimersByTimeAsync(500)
    expect(onLongPressCallback).toHaveBeenCalledTimes(0)

    // pointer up to cancel callback
    element.value.dispatchEvent(pointerUpEvent)

    // wait for 500ms after pointer up
    await vi.advanceTimersByTimeAsync(500)
    expect(onLongPressCallback).toHaveBeenCalledTimes(0)

    // another pointer down
    element.value.dispatchEvent(pointerdownEvent)

    // pointer move within threshold
    await vi.advanceTimersByTimeAsync(500)
    element.value.dispatchEvent(moveWithinThresholdEvent)
    await vi.advanceTimersByTimeAsync(500)
    expect(onLongPressCallback).toHaveBeenCalledTimes(1)
  }

  async function triggerOnMouseUp(isRef: boolean) {
    const onLongPressCallback = vi.fn()
    const onMouseUpCallback = vi.fn()
    onLongPress(isRef ? element : element.value, onLongPressCallback, { onMouseUp: onMouseUpCallback })

    // first pointer down
    pointerdownEvent = new PointerEvent('pointerdown', { cancelable: true, bubbles: true })
    element.value.dispatchEvent(pointerdownEvent)

    // wait for 250 after pointer down
    await vi.advanceTimersByTimeAsync(250)
    expect(onLongPressCallback).toHaveBeenCalledTimes(0)
    expect(onMouseUpCallback).toHaveBeenCalledTimes(0)

    // pointer up to cancel callback
    pointerUpEvent = new PointerEvent('pointerup', { cancelable: true, bubbles: true })
    element.value.dispatchEvent(pointerUpEvent)
    expect(onMouseUpCallback).toHaveBeenCalledTimes(1)
    expect(onMouseUpCallback).toBeCalledWith(expect.any(Number), 0, false)
    expect(onMouseUpCallback.mock.calls[0][0]).toBeGreaterThanOrEqual(250 - 2)

    // wait for 500ms after pointer up
    await vi.advanceTimersByTimeAsync(500)
    expect(onLongPressCallback).toHaveBeenCalledTimes(0)

    // another pointer down
    pointerdownEvent = new PointerEvent('pointerdown', { cancelable: true, bubbles: true })
    element.value.dispatchEvent(pointerdownEvent)

    // wait for 500 after pointer down
    await vi.advanceTimersByTimeAsync(500)
    expect(onLongPressCallback).toHaveBeenCalledTimes(1)
    expect(onMouseUpCallback).toHaveBeenCalledTimes(1)

    pointerUpEvent = new PointerEvent('pointerup', { cancelable: true, bubbles: true })
    element.value.dispatchEvent(pointerUpEvent)
    expect(onMouseUpCallback).toHaveBeenCalledTimes(2)
    expect(onMouseUpCallback).toBeCalledWith(expect.any(Number), 0, true)
    expect(onMouseUpCallback.mock.calls[1][0]).toBeGreaterThanOrEqual(500 - 2)
  }

  function suites(isRef: boolean) {
    describe('given no options', () => {
      it('should trigger longpress after 500ms', () => triggerCallback(isRef))
    })

    describe('given options', () => {
      it('should trigger longpress after options.delay ms', () => triggerCallbackWithDelay(isRef))
      it('should not trigger longpress when child element on longpress', () => notTriggerCallbackOnChildLongPress(isRef))
      it('should work with once and prevent modifiers', () => workOnceAndPreventModifiers(isRef))
      it('should stop propagation', () => stopPropagation(isRef))
      it('should remove event listeners after being stopped', () => stopEventListeners(isRef))
      it('should trigger longpress if pointer is moved', () => triggerCallbackWithThreshold(isRef))
      it('should trigger onMouseUp when pointer is released', () => triggerOnMouseUp(isRef))
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
