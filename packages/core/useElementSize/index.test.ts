import { beforeEach, describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
import { useResizeObserver } from '../useResizeObserver'
import { useElementSize } from './index'

vi.mock('../useResizeObserver', () => ({
  useResizeObserver: vi.fn(() => ({
    stop: vi.fn(),
  })),
}))

describe('useElementSize', () => {
  beforeEach(() => {
    vi.mocked(useResizeObserver).mockClear()
  })

  it('uses contentRect for SVG elements instead of transformed bounds', () => {
    const target = shallowRef(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
    target.value.getBoundingClientRect = vi.fn(() => ({
      bottom: 200,
      height: 200,
      left: 0,
      right: 200,
      top: 0,
      width: 200,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    }))

    const size = useElementSize(target)
    const callback = vi.mocked(useResizeObserver).mock.lastCall?.[1]

    callback?.([
      {
        contentRect: {
          height: 100,
          width: 100,
        },
      } as ResizeObserverEntry,
    ], {} as ResizeObserver)

    expect(size.width.value).toBe(100)
    expect(size.height.value).toBe(100)
    expect(target.value.getBoundingClientRect).not.toHaveBeenCalled()
  })
})
