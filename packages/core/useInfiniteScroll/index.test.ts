import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
import { useInfiniteScroll } from './index'

describe('useInfiniteScroll', () => {
  it('should be defined', () => {
    expect(useInfiniteScroll).toBeDefined()
  })

  describe('trigger option', () => {
    let el: HTMLDivElement
    let mockIntersectionObserverCb: IntersectionObserverCallback
    let mockIntersectionObserverOptions: IntersectionObserverInit | undefined

    beforeAll(() => {
      class MockIntersectionObserver {
        constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
          mockIntersectionObserverCb = callback
          mockIntersectionObserverOptions = options
        }

        observe = vi.fn()
        unobserve = vi.fn()
        disconnect = vi.fn()
        takeRecords = vi.fn(() => [] as IntersectionObserverEntry[])
        root = null
        rootMargin = ''
        thresholds = []
      }
      vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    })

    beforeEach(() => {
      el = document.createElement('div')
      Object.defineProperties(el, {
        scrollHeight: { value: 2000, configurable: true },
        clientHeight: { value: 500, configurable: true },
        scrollTop: { value: 0, configurable: true, writable: true },
      })
    })

    it('should trigger onLoadMore based on trigger visibility', async () => {
      const trigger = shallowRef(document.createElement('div'))
      const onLoadMore = vi.fn(() => Promise.resolve())

      useInfiniteScroll(el, onLoadMore, { trigger })

      mockIntersectionObserverCb(
        [{ isIntersecting: true, time: 1 } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )

      await vi.waitFor(() => {
        expect(onLoadMore).toHaveBeenCalled()
      })
    })

    it('should not call onLoadMore when trigger is not intersecting', async () => {
      const trigger = shallowRef(document.createElement('div'))
      const onLoadMore = vi.fn(() => Promise.resolve())

      useInfiniteScroll(el, onLoadMore, { trigger })

      mockIntersectionObserverCb(
        [{ isIntersecting: false, time: 1 } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(onLoadMore).not.toHaveBeenCalled()
    })

    it('should load again while trigger is still visible', async () => {
      const trigger = shallowRef(document.createElement('div'))
      const onLoadMore = vi.fn(() => Promise.resolve())

      useInfiniteScroll(el, onLoadMore, { trigger, interval: 10 })

      mockIntersectionObserverCb(
        [{ isIntersecting: true, time: 1 } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      )

      await vi.waitFor(() => {
        expect(onLoadMore.mock.calls.length).toBeGreaterThanOrEqual(2)
      })
    })

    it('should load on reset', async () => {
      const trigger = shallowRef(document.createElement('div'))
      const onLoadMore = vi.fn(() => Promise.resolve())

      const { reset } = useInfiniteScroll(el, onLoadMore, { trigger })

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(onLoadMore).not.toHaveBeenCalled()

      reset()

      await vi.waitFor(() => {
        expect(onLoadMore).toHaveBeenCalledTimes(1)
      })
    })

    it('should use distance as rootMargin', async () => {
      const trigger = shallowRef(document.createElement('div'))
      const onLoadMore = vi.fn(() => Promise.resolve())

      useInfiniteScroll(el, onLoadMore, { trigger, distance: 200 })

      await new Promise(resolve => setTimeout(resolve, 50))
      expect(mockIntersectionObserverOptions?.rootMargin).toBe('0px 0px 200px 0px')
    })
  })
})
