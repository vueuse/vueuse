import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import { ref as deepRef, defineComponent, useTemplateRef } from 'vue'
import { useInfiniteScroll } from './index'

describe('useInfiniteScroll', () => {
  enableAutoUnmount(afterEach)

  it('should be defined', () => {
    expect(useInfiniteScroll).toBeDefined()
  })

  it('basic usage', async () => {
    const handlerSpy = vi.fn()
    const wrapper = mount(defineComponent({
      template: `
        <div ref="el" style="height: 50px; overflow: auto;">
          <div style="height: 100px;"></div>
          <div v-for="i in data" style="height: 100px;">
            {{ i }}
          </div>
        </div>
      `,
      setup() {
        const data = deepRef<number[]>([])
        const el = useTemplateRef<HTMLElement>('el')

        handlerSpy.mockImplementation(() => data.value.push(1))
        useInfiniteScroll(el, handlerSpy)

        return { data, el }
      },
    }), { attachTo: document.body })

    const vm = wrapper.vm

    expect(vm.el!.scrollHeight).toBe(100)
    await flushPromises()
    expect(handlerSpy).not.toBeCalled()

    vm.el!.scrollTo({ top: 20 })
    await flushPromises()
    expect(handlerSpy).not.toBeCalled()

    vm.el!.scrollTo({ top: 50 })
    await vi.waitFor(() => {
      expect(handlerSpy).toHaveBeenCalled()
    })

    await flushPromises()
    expect(vm.el!.scrollHeight).toBe(200)
  })

  it('should not call loadMore when canLoadMore returns false', async () => {
    const handlerSpy = vi.fn()
    const canLoadMoreSpy = vi.fn(() => false)
    mount(defineComponent({
      template: `
        <div ref="el" style="height: 50px; overflow: auto;">
          <div style="height: 50px;"></div>
        </div>
      `,
      setup() {
        const el = useTemplateRef<HTMLElement>('el')
        useInfiniteScroll(el, handlerSpy, {
          canLoadMore: canLoadMoreSpy,
        })
      },
    }), { attachTo: document.body })

    await flushPromises()
    expect(canLoadMoreSpy).toHaveBeenCalledOnce()
    expect(handlerSpy).not.toBeCalled()
  })

  describe('trigger option', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should trigger onLoadMore when trigger element becomes visible', async () => {
      const onLoadMore = vi.fn(() => Promise.resolve())

      const Component = defineComponent({
        template: `
          <div ref="el" id="scroll-container" style="height: 200px; overflow: auto;">
            <div style="height: 500px;">Content</div>
            <div ref="trigger" id="trigger-el" style="height: 50px;">Trigger</div>
          </div>
        `,
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const trigger = useTemplateRef<HTMLElement>('trigger')
          useInfiniteScroll(el, onLoadMore, { trigger })
        },
      })

      page.render(Component)

      await vi.advanceTimersByTimeAsync(150)
      expect(onLoadMore).not.toHaveBeenCalled()

      // Scroll to make trigger visible
      const container = document.getElementById('scroll-container')!
      container.scrollTo(0, 500)

      await vi.waitFor(() => {
        expect(onLoadMore).toHaveBeenCalled()
      })
    })

    it('should not call onLoadMore when trigger is not intersecting', async () => {
      const onLoadMore = vi.fn(() => Promise.resolve())

      const Component = defineComponent({
        template: `
          <div ref="el" style="height: 200px; overflow: auto;">
            <div style="height: 500px;">Content</div>
            <div ref="trigger" style="height: 50px;">Trigger</div>
          </div>
        `,
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const trigger = useTemplateRef<HTMLElement>('trigger')
          useInfiniteScroll(el, onLoadMore, { trigger })
        },
      })

      page.render(Component)

      // Wait without scrolling - trigger should not be visible
      await vi.advanceTimersByTimeAsync(300)
      expect(onLoadMore).not.toHaveBeenCalled()
    })

    it('should load again while trigger is still visible', async () => {
      const onLoadMore = vi.fn(() => Promise.resolve())

      const Component = defineComponent({
        template: `
          <div ref="el" id="scroll-container-2" style="height: 200px; overflow: auto;">
            <div style="height: 500px;">Content</div>
            <div ref="trigger" style="height: 50px;">Trigger</div>
          </div>
        `,
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const trigger = useTemplateRef<HTMLElement>('trigger')
          useInfiniteScroll(el, onLoadMore, { trigger, interval: 10 })
        },
      })

      page.render(Component)

      const container = document.getElementById('scroll-container-2')!
      container.scrollTo(0, 500)

      await vi.waitFor(() => {
        expect(onLoadMore.mock.calls.length).toBeGreaterThanOrEqual(2)
      })
    })

    it('should load on reset', async () => {
      const onLoadMore = vi.fn(() => Promise.resolve())
      let resetFn: () => void

      const Component = defineComponent({
        template: `
          <div ref="el" style="height: 200px; overflow: auto;">
            <div style="height: 500px;">Content</div>
            <div ref="trigger" style="height: 50px;">Trigger</div>
          </div>
        `,
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const trigger = useTemplateRef<HTMLElement>('trigger')
          const { reset } = useInfiniteScroll(el, onLoadMore, { trigger })
          resetFn = reset
        },
      })

      page.render(Component)

      await vi.advanceTimersByTimeAsync(150)
      expect(onLoadMore).not.toHaveBeenCalled()

      resetFn!()

      await vi.waitFor(() => {
        expect(onLoadMore).toHaveBeenCalledTimes(1)
      })
    })

    it('should use distance as rootMargin', async () => {
      const onLoadMore = vi.fn(() => Promise.resolve())

      const Component = defineComponent({
        template: `
          <div ref="el" id="scroll-container-3" style="height: 200px; overflow: auto;">
            <div style="height: 500px;">Content</div>
            <div ref="trigger" style="height: 50px;">Trigger</div>
          </div>
        `,
        setup() {
          const el = useTemplateRef<HTMLElement>('el')
          const trigger = useTemplateRef<HTMLElement>('trigger')
          useInfiniteScroll(el, onLoadMore, { trigger, distance: 200 })
        },
      })

      page.render(Component)

      // With distance: 200, trigger should be detected earlier
      // The trigger is at 500px, container is 200px tall
      // Without distance: need to scroll to ~300px to see trigger
      // With distance 200: need to scroll to ~100px
      const container = document.getElementById('scroll-container-3')!
      container.scrollTo(0, 150)

      await vi.waitFor(() => {
        expect(onLoadMore).toHaveBeenCalled()
      })
    })
  })
})
