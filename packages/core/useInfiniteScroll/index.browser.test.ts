import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
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
})
