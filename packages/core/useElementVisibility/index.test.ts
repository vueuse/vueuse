import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { useElementVisibility } from '.'

describe('useElementVisibility', () => {
  let el: HTMLDivElement

  beforeEach(() => {
    el = document.createElement('div')
  })

  it('should work when el is not an element', async () => {
    const visible = useElementVisibility(null)
    expect(visible.value).toBeFalsy()
  })

  it('should work when window is undefined', () => {
    // @ts-expect-error set window null
    const visible = useElementVisibility(el, { window: null })
    expect(visible.value).toBeFalsy()
  })

  describe('when internally using useIntersectionObserver', async () => {
    const { useIntersectionObserver } = await import('../useIntersectionObserver')

    beforeAll(() => {
      vi.resetAllMocks()
      vi.mock('../useIntersectionObserver')
    })

    it('should call useIntersectionObserver internally', () => {
      expect(useIntersectionObserver).toHaveBeenCalledTimes(0)
      useElementVisibility(el)
      expect(useIntersectionObserver).toHaveBeenCalledTimes(1)
    })

    it('passes the given element to useIntersectionObserver', () => {
      useElementVisibility(el)
      expect(vi.mocked(useIntersectionObserver).mock.lastCall?.[0]).toBe(el)
    })

    it('passes a callback to useIntersectionObserver that sets visibility to false only when isIntersecting is false', () => {
      const isVisible = useElementVisibility(el)
      const callback = vi.mocked(useIntersectionObserver).mock.lastCall?.[1]
      const callMockCallbackWithIsIntersectingValue = (isIntersecting: boolean) => callback?.([{ isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver)

      // It should be false initially
      expect(isVisible.value).toBe(false)

      // It should still be false if the callback doesn't get an isIntersecting = true
      callMockCallbackWithIsIntersectingValue(false)
      expect(isVisible.value).toBe(false)

      // But it should become true if the callback gets an isIntersecting = true
      callMockCallbackWithIsIntersectingValue(true)
      expect(isVisible.value).toBe(true)

      // And it should become false again if isIntersecting = false
      callMockCallbackWithIsIntersectingValue(false)
      expect(isVisible.value).toBe(false)
    })

    it('passes the given window to useIntersectionObserver', () => {
      const mockWindow = {} as Window

      useElementVisibility(el, { window: mockWindow })
      expect(vi.mocked(useIntersectionObserver).mock.lastCall?.[2]).toContain({ window: mockWindow })
    })

    it('uses the given scrollTarget as the root element in useIntersectionObserver', () => {
      const mockScrollTarget = document.createElement('div')

      useElementVisibility(el, { scrollTarget: mockScrollTarget })
      expect(vi.mocked(useIntersectionObserver).mock.lastCall?.[2]).toContain({ root: mockScrollTarget })
    })
  })
})
