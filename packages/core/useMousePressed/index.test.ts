import type { UseMousePressedReturn } from './index'
import { describe, expect, it, vi } from 'vitest'
import { useMousePressed } from './index'

type expectSourceType = 'mouse' | 'touch' | null
/**
 * assert return values of useMousePressed
 */
function assertReturnValue(options: { returnValue: UseMousePressedReturn, expect: { pressed: boolean, sourceType: expectSourceType } }) {
  const { returnValue: { pressed, sourceType } } = options
  expect(pressed.value).toBe(options.expect.pressed)
  expect(sourceType.value).toBe(options.expect.sourceType)
}
/**
 * simulate press and release events
 */
function pressAndReleaseByEvent(options: { triggerEvent: keyof WindowEventMap, cleanupEvent: keyof WindowEventMap, expect: { sourceType: expectSourceType } }) {
  const { triggerEvent, cleanupEvent, expect: { sourceType } } = options
  const returnValue = useMousePressed()
  window.dispatchEvent(new Event(triggerEvent))
  assertReturnValue({ returnValue, expect: { pressed: true, sourceType } })

  window.dispatchEvent(new Event(cleanupEvent))
  assertReturnValue({ returnValue, expect: { pressed: false, sourceType: null } })
}

describe('useMousePressed', () => {
  it('should be defined', () => {
    expect(useMousePressed).toBeDefined()
  })

  describe('params', () => {
    describe('initial value', () => {
      it('default value', () => {
        const returnValue = useMousePressed()
        assertReturnValue({ returnValue, expect: { pressed: false, sourceType: null } })
      })

      it('custom value', () => {
        const returnValue = useMousePressed({ initialValue: true })
        assertReturnValue({ returnValue, expect: { pressed: true, sourceType: null } })
      })
    })

    describe('target', () => {
      it('does\'t has a target element', () => {
        const returnValue = useMousePressed()
        window.dispatchEvent(new Event('mousedown'))
        assertReturnValue({ returnValue, expect: { pressed: true, sourceType: 'mouse' } })
      })

      it('has a target element', () => {
        const targetEle = document.createElement('button')
        const returnValue = useMousePressed({ target: targetEle })
        targetEle.dispatchEvent(new Event('dragstart'))
        assertReturnValue({ returnValue, expect: { pressed: true, sourceType: 'mouse' } })
      })
    })

    it('onPressed & onReleased callback', () => {
      const onPressed = vi.fn()
      const onReleased = vi.fn()
      useMousePressed({ onPressed, onReleased })

      window.dispatchEvent(new MouseEvent('mousedown'))
      expect(onPressed).toHaveBeenCalled()

      window.dispatchEvent(new MouseEvent('mouseup'))
      expect(onReleased).toHaveBeenCalled()
    })
  })

  describe('trigger & cleanup events', () => {
    describe('mouse event', () => {
      it('mouseup', () => {
        pressAndReleaseByEvent({ triggerEvent: 'mousedown', cleanupEvent: 'mouseup', expect: { sourceType: 'mouse' } })
      })

      it('mouseleave', () => {
        pressAndReleaseByEvent({ triggerEvent: 'mousedown', cleanupEvent: 'mouseleave', expect: { sourceType: 'mouse' } })
      })
    })

    describe('drag event', () => {
      it('drop', () => {
        pressAndReleaseByEvent({ triggerEvent: 'dragstart', cleanupEvent: 'drop', expect: { sourceType: 'mouse' } })
      })

      it('dragend', () => {
        pressAndReleaseByEvent({ triggerEvent: 'dragstart', cleanupEvent: 'dragend', expect: { sourceType: 'mouse' } })
      })
    })

    describe('touch event', () => {
      it('touchend', () => {
        pressAndReleaseByEvent({ triggerEvent: 'touchstart', cleanupEvent: 'touchend', expect: { sourceType: 'touch' } })
      })

      it('touchcancel', () => {
        pressAndReleaseByEvent({ triggerEvent: 'touchstart', cleanupEvent: 'touchcancel', expect: { sourceType: 'touch' } })
      })
    })
  })
})
