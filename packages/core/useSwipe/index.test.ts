import each from 'jest-each'
import { useSetup } from '../../.test'
import { SwipeDirection, useSwipe } from './index'

describe('useSwipe', () => {
  const target = document.createElement('div')
  target.id = 'target'
  document.body.appendChild(target)

  const mockTouchEventInit = (x: number, y: number): TouchEventInit => ({
    touches: [{
      clientX: x,
      clientY: y,
      force: 0,
      identifier: 0,
      pageX: 0,
      pageY: 0,
      radiusX: 0,
      radiusY: 0,
      rotationAngle: 0,
      screenX: 0,
      screenY: 0,
      target,
    }],
  })

  const mockTouchStart = (x: number, y: number) => new TouchEvent('touchstart', mockTouchEventInit(x, y))
  const mockTouchMove = (x: number, y: number) => new TouchEvent('touchmove', mockTouchEventInit(x, y))
  const mockTouchEnd = (x: number, y: number) => new TouchEvent('touchend', mockTouchEventInit(x, y))

  const mockTouchEvents = (target: EventTarget, coords: Array<number[]>) => {
    coords.forEach(([x, y], i) => {
      if (i === 0)
        target.dispatchEvent(mockTouchStart(x, y))
      else if (i === coords.length - 1)
        target.dispatchEvent(mockTouchEnd(x, y))
      else
        target.dispatchEvent(mockTouchMove(x, y))
    })
  }

  const onSwipe = sinon.spy((e: TouchEvent) => {})
  const onSwipeEnd = sinon.spy((e: TouchEvent, direction: SwipeDirection) => {})
  const threshold = 30

  beforeEach(() => {
    onSwipe.resetHistory()
    onSwipeEnd.resetHistory()
  })

  it('threshold not exceeded', () => {
    useSetup(() => {
      useSwipe(target, { threshold, onSwipe, onSwipeEnd })

      mockTouchEvents(target, [[0, 0], [threshold - 1, 0], [threshold - 1, 0]])

      expect(onSwipe).not.toBeCalled()
      expect(onSwipeEnd).not.toBeCalled()
    })
  })

  it('threshold exceeded', () => {
    useSetup(() => {
      useSwipe(target, { threshold, onSwipe, onSwipeEnd })

      mockTouchEvents(target, [[0, 0], [threshold / 2, 0], [threshold, 0], [threshold, 0]])

      expect(onSwipe).toBeCalledOnce()
      expect(onSwipeEnd).toBeCalledOnce()
    })
  })

  it('threshold exceeded in between', () => {
    useSetup(() => {
      useSwipe(target, { threshold, onSwipe, onSwipeEnd })

      mockTouchEvents(target, [[0, 0], [threshold / 2, 0], [threshold, 0], [threshold - 1, 0], [threshold - 1, 0]])

      expect(onSwipe).toBeCalledTimes(2)
      expect(onSwipeEnd).toBeCalledOnce()
      expect(onSwipeEnd.lastCall[0]).toBe(SwipeDirection.NONE)
    })
  })

  it('reactivity', () => {
    useSetup(() => {
      const { isSwiping, direction, lengthX, lengthY } = useSwipe(target, { threshold, onSwipe, onSwipeEnd })

      target.dispatchEvent(mockTouchStart(0, 0))
      expect(isSwiping.value).toBeFalsy()
      expect(direction.value).toBe(SwipeDirection.NONE)
      expect(lengthX.value).toBe(0)
      expect(lengthY.value).toBe(0)

      target.dispatchEvent(mockTouchMove(threshold, 5))
      expect(isSwiping.value).toBeTruthy()
      expect(direction.value).toBe(SwipeDirection.RIGHT)
      expect(lengthX.value).toBe(-threshold)
      expect(lengthY.value).toBe(-5)

      target.dispatchEvent(mockTouchEnd(threshold, 5))
    })
  })

  each([
    [SwipeDirection.UP, [[0, 2 * threshold], [0, threshold], [0, threshold]]],
    [SwipeDirection.DOWN, [[0, 0], [0, threshold], [0, threshold]]],
    [SwipeDirection.LEFT, [[2 * threshold, 0], [threshold, 0], [threshold, 0]]],
    [SwipeDirection.RIGHT, [[0, 0], [threshold, 0], [threshold, 0]]],
  ]).it('swipe %s', (expected, coords) => {
    useSetup(() => {
      const { direction } = useSwipe(target, { threshold, onSwipe, onSwipeEnd })

      mockTouchEvents(target, coords)

      expect(direction.value).toBe(expected)
      expect(onSwipeEnd.firstCall[0]).toBe(expected)
    })
  })
})
