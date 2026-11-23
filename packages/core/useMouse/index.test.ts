import { describe, expect, it } from 'vitest'
import { isReadonly, shallowRef } from 'vue'
import { useMouse } from './index'

describe('useMouse', () => {
  const target = document.createElement('div')
  document.body.appendChild(target)

  const touchEventInit = (x: number, y: number): TouchEventInit => ({
    touches: [{
      clientX: x,
      clientY: y,
      force: 0,
      identifier: 0,
      pageX: x,
      pageY: y,
      radiusX: 0,
      radiusY: 0,
      rotationAngle: 0,
      screenX: x,
      screenY: y,
      target,
    }],
  })

  it('updates position from touch', () => {
    const { x, y, sourceType } = useMouse({ target })

    target.dispatchEvent(new TouchEvent('touchstart', touchEventInit(10, 20)))

    expect([x.value, y.value, sourceType.value]).toEqual([10, 20, 'touch'])
  })

  it('resets on touchend when resetOnTouchEnds is set', () => {
    const { x, y } = useMouse({ target, resetOnTouchEnds: true, initials: { x: 1, y: 2 } })

    target.dispatchEvent(new TouchEvent('touchstart', touchEventInit(10, 20)))
    expect([x.value, y.value]).toEqual([10, 20])

    target.dispatchEvent(new TouchEvent('touchend'))
    expect([x.value, y.value]).toEqual([1, 2])
  })

  it('resets on touchcancel when resetOnTouchEnds is set', () => {
    const { x, y } = useMouse({ target, resetOnTouchEnds: true, initials: { x: 1, y: 2 } })

    target.dispatchEvent(new TouchEvent('touchstart', touchEventInit(10, 20)))
    expect([x.value, y.value]).toEqual([10, 20])

    // the browser takes the gesture over (scroll, system dialog): touchcancel
    // fires and touchend never does
    target.dispatchEvent(new TouchEvent('touchcancel'))
    expect([x.value, y.value]).toEqual([1, 2])
  })

  it('keeps the last position when resetOnTouchEnds is not set', () => {
    const { x, y } = useMouse({ target })

    target.dispatchEvent(new TouchEvent('touchstart', touchEventInit(10, 20)))
    target.dispatchEvent(new TouchEvent('touchend'))
    target.dispatchEvent(new TouchEvent('touchcancel'))

    expect([x.value, y.value]).toEqual([10, 20])
  })

  it('should return readonly refs', () => {
    const { x, y, sourceType } = useMouse({ target })

    expect(isReadonly(x)).toBe(true)
    expect(isReadonly(y)).toBe(true)
    expect(isReadonly(sourceType)).toBe(true)
  })

  describe('initials', () => {
    it('should default to 0', () => {
      const { x, y, sourceType } = useMouse({ target })

      expect([x.value, y.value, sourceType.value]).toEqual([0, 0, null])
    })

    it('should seed from plain values', () => {
      const { x, y } = useMouse({ target, initials: { x: 1, y: 2 } })

      expect([x.value, y.value]).toEqual([1, 2])
    })

    it('should use passed refs as internal state', () => {
      const x = shallowRef(1)
      const y = shallowRef(2)
      const mouse = useMouse({ target, initials: { x, y } })

      expect(mouse.x).not.toBe(x)

      target.dispatchEvent(new TouchEvent('touchstart', touchEventInit(10, 20)))
      expect([x.value, y.value]).toEqual([10, 20])

      x.value = 42
      expect(mouse.x.value).toBe(42)
    })

    it('should reset to the initial values of passed refs', () => {
      const x = shallowRef(1)
      const y = shallowRef(2)
      useMouse({ target, resetOnTouchEnds: true, initials: { x, y } })

      target.dispatchEvent(new TouchEvent('touchstart', touchEventInit(10, 20)))
      target.dispatchEvent(new TouchEvent('touchend'))

      expect([x.value, y.value]).toEqual([1, 2])
    })

    it('should support deprecated initialValue', () => {
      const { x, y } = useMouse({ target, initialValue: { x: 1, y: 2 } })

      expect([x.value, y.value]).toEqual([1, 2])
    })

    it('should prefer initials over deprecated initialValue', () => {
      const { x, y } = useMouse({ target, initialValue: { x: 1, y: 2 }, initials: { x: 3 } })

      expect([x.value, y.value]).toEqual([3, 2])
    })
  })
})
