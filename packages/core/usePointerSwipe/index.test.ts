import { SwipeDirection } from '../useSwipe'
import type { PointerSwipeOptions } from './index'
import { usePointerSwipe } from './index'

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

describe('usePointerSwipe', () => {
  const target = document.createElement('div')
  target.id = 'target'
  // set to noop, else test will fail
  target.setPointerCapture = (pointerId: number) => {}
  document.body.appendChild(target)

  const threshold = 30
  let onSwipeStart: any
  let onSwipe: any
  let onSwipeEnd: any

  const options = (): PointerSwipeOptions => ({
    threshold,
    onSwipeStart,
    onSwipe,
    onSwipeEnd,
  })

  beforeEach(() => {
    onSwipeStart = vitest.fn((e: PointerEvent) => {})
    onSwipe = vitest.fn((e: PointerEvent) => {})
    onSwipeEnd = vitest.fn((e: PointerEvent, direction: SwipeDirection) => {})
  })

  it('threshold is not exceeded', () => {
    usePointerSwipe(target, options())

    mockPointerEvents(target, [[0, 0], [threshold - 1, 0], [threshold - 1, 0]])

    expect(onSwipeStart.mock.calls.length).toBe(1)
    expect(onSwipe.mock.calls.length).toBe(0)
    expect(onSwipeEnd.mock.calls.length).toBe(0)
  })

  it('threshold is exceeded', () => {
    usePointerSwipe(target, options())

    mockPointerEvents(target, [[0, 0], [threshold / 2, 0], [threshold, 0], [threshold, 0]])

    expect(onSwipeStart).toHaveBeenCalledOnce()
    expect(onSwipe).toHaveBeenCalledOnce()
    expect(onSwipeEnd).toHaveBeenCalledOnce()
    expect(onSwipeEnd).toHaveBeenCalledWith(expect.anything(), SwipeDirection.RIGHT)
  })

  it('threshold is exceeded in between', () => {
    usePointerSwipe(target, options())

    mockPointerEvents(target, [[0, 0], [threshold / 2, 0], [threshold, 0], [threshold - 1, 0], [threshold - 1, 0]])

    expect(onSwipeStart).toHaveBeenCalledOnce()
    expect(onSwipe).toHaveBeenCalledTimes(2)
    expect(onSwipeEnd).toHaveBeenCalledOnce()
    expect(onSwipeEnd).toHaveBeenCalledWith(expect.anything(), SwipeDirection.NONE)
  })

  it('reactivity', () => {
    const { isSwiping, direction, distanceX, distanceY } = usePointerSwipe(target, options())

    target.dispatchEvent(mockPointerDown(0, 0))
    expect(isSwiping.value).toBeFalsy()
    expect(direction.value).toBe(SwipeDirection.NONE)
    expect(distanceX.value).toBe(0)
    expect(distanceY.value).toBe(0)

    target.dispatchEvent(mockPointerMove(threshold, threshold / 2))
    expect(isSwiping.value).toBeTruthy()
    expect(direction.value).toBe(SwipeDirection.RIGHT)
    expect(distanceX.value).toBe(-threshold)
    expect(distanceY.value).toBe(-threshold / 2)

    target.dispatchEvent(mockPointerUp(threshold, threshold / 2))
  })

  const directionTests = [
    [SwipeDirection.UP, [[0, 2 * threshold], [0, threshold], [0, threshold]]],
    [SwipeDirection.DOWN, [[0, 0], [0, threshold], [0, threshold]]],
    [SwipeDirection.LEFT, [[2 * threshold, 0], [threshold, 0], [threshold, 0]]],
    [SwipeDirection.RIGHT, [[0, 0], [threshold, 0], [threshold, 0]]],
  ]

  directionTests.forEach((config) => {
    const _direction = config[0] as unknown as SwipeDirection
    const coords = config[1] as unknown as number[][]

    it(`detects swipes to the ${_direction}`, () => {
      const { direction } = usePointerSwipe(target, options())

      mockPointerEvents(target, coords)

      expect(direction.value).toBe(_direction)
      expect(onSwipeEnd).toHaveBeenLastCalledWith(expect.anything(), _direction)
    })
  })
})
