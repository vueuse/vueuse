import { SwipeDirection, useSwipe } from './index'
import { useSetup } from '../../.test'

import each from 'jest-each'

// polyfill for jsdom (https://github.com/jsdom/jsdom/pull/2666)
if (!global.PointerEvent) {
  class PointerEvent extends MouseEvent {
    public pointerId?: number

    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params)
      this.pointerId = params.pointerId
    }
  }
  global.PointerEvent = PointerEvent as any
}

describe('useSwipe', () => {
  const target = document.createElement('div')
  // set to noop, else test will fail
  target.setPointerCapture = (pointerId: number) => {}
  target.id = 'target'
  document.body.appendChild(target)

  const mockPointerEventInit = (x: number, y: number): PointerEventInit => ({
    clientX: x,
    clientY: y,
  })

  const mockPointerDown = (x: number, y: number) => new PointerEvent('pointerdown', mockPointerEventInit(x, y))
  const mockPointerMove = (x: number, y: number) => new PointerEvent('pointermove', mockPointerEventInit(x, y))
  const mockPointerUp = (x: number, y: number) => new PointerEvent('pointerup', mockPointerEventInit(x, y))

  const mockPointerEvents = (target: Element, coords: Array<number[]>) => {
    coords.forEach(([x, y], i) => {
      if (i === 0)
        target.dispatchEvent(mockPointerDown(x, y))
      else if (i === coords.length - 1)
        target.dispatchEvent(mockPointerUp(x, y))
      else
        target.dispatchEvent(mockPointerMove(x, y))
    })
  }

  let onSwipe: jest.Mock
  let onSwipeEnd: jest.Mock
  const threshold = 30

  beforeEach(() => {
    onSwipe = jest.fn((e: PointerEvent) => {})
    onSwipeEnd = jest.fn((e: PointerEvent, direction: SwipeDirection) => {})
  })

  it('threshold not exceeded', () => {
    useSetup(() => {
      useSwipe(target, { threshold, onSwipe, onSwipeEnd })

      mockPointerEvents(target, [[0, 0], [threshold - 1, 0], [threshold - 1, 0]])

      expect(onSwipe.mock.calls.length).toBe(0)
      expect(onSwipeEnd.mock.calls.length).toBe(0)
    })
  })

  it('threshold exceeded', () => {
    useSetup(() => {
      useSwipe(target, { threshold, onSwipe, onSwipeEnd })

      mockPointerEvents(target, [[0, 0], [threshold / 2, 0], [threshold, 0], [threshold, 0]])

      expect(onSwipe.mock.calls.length).toBe(1)
      expect(onSwipeEnd.mock.calls.length).toBe(1)
    })
  })

  it('threshold exceeded in between', () => {
    useSetup(() => {
      useSwipe(target, { threshold, onSwipe, onSwipeEnd })

      mockPointerEvents(target, [[0, 0], [threshold / 2, 0], [threshold, 0], [threshold - 1, 0], [threshold - 1, 0]])

      expect(onSwipe.mock.calls.length).toBe(2)
      expect(onSwipeEnd.mock.calls.length).toBe(1)
      expect(onSwipeEnd.mock.calls[0][1]).toBe(SwipeDirection.NONE)
    })
  })

  it('reactivity', () => {
    useSetup(() => {
      const { isSwiping, direction, lengthX, lengthY } = useSwipe(target, { threshold, onSwipe, onSwipeEnd })

      target.dispatchEvent(mockPointerDown(0, 0))
      expect(isSwiping.value).toBeFalsy()
      expect(direction.value).toBe(SwipeDirection.NONE)
      expect(lengthX.value).toBe(0)
      expect(lengthY.value).toBe(0)

      target.dispatchEvent(mockPointerMove(threshold, 5))
      expect(isSwiping.value).toBeTruthy()
      expect(direction.value).toBe(SwipeDirection.RIGHT)
      expect(lengthX.value).toBe(-threshold)
      expect(lengthY.value).toBe(-5)

      target.dispatchEvent(mockPointerUp(threshold, 5))
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

      mockPointerEvents(target, coords)

      expect(direction.value).toBe(expected)
      expect(onSwipeEnd.mock.calls[0][1]).toBe(expected)
    })
  })
})
