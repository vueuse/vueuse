import { describe, expect, it } from 'vitest'
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
    const { x, y } = useMouse({ target, resetOnTouchEnds: true, initialValue: { x: 1, y: 2 } })

    target.dispatchEvent(new TouchEvent('touchstart', touchEventInit(10, 20)))
    expect([x.value, y.value]).toEqual([10, 20])

    target.dispatchEvent(new TouchEvent('touchend'))
    expect([x.value, y.value]).toEqual([1, 2])
  })

  it('resets on touchcancel when resetOnTouchEnds is set', () => {
    const { x, y } = useMouse({ target, resetOnTouchEnds: true, initialValue: { x: 1, y: 2 } })

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
})
