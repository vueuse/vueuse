import { describe, it, expect, vi } from 'vitest'
import { useMountedQueue } from '.'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue-demi'

describe('useMountedQueue', () => {
  it('should add and execute functions in the queue when mounted', async () => {
    const wrapper = mount(defineComponent({
      setup() {
        const { addQueue } = useMountedQueue()
        const fn = vi.fn()
        addQueue(fn)
        return { fn }
      },
      template: '<div></div>',
    }))

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.fn).toHaveBeenCalled()
  })

  it('should add functions to the queue when not mounted and execute them when mounted', async () => {
    const wrapper = mount(defineComponent({
      setup() {
        const { addQueue } = useMountedQueue()
        const fn = vi.fn()
        addQueue(fn)
        return { fn }
      },
      template: '<div></div>',
    }))

    expect(wrapper.vm.fn).not.toHaveBeenCalled()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.fn).toHaveBeenCalled()
  })

  it('should execute functions in the order of their priority', async () => {
    const results: number[] = []
    const wrapper = mount(defineComponent({
      setup() {
        const { addQueue } = useMountedQueue()
        addQueue(() => results.push(1), 1)
        addQueue(() => results.push(2), 2)
        addQueue(() => results.push(3), 3)
        return { results }
      },
      template: '<div></div>',
    }))

    await wrapper.vm.$nextTick()
    expect(results).toEqual([3, 2, 1])
  })

  it('should remove functions from the queue', async () => {
    const wrapper = mount(defineComponent({
      setup() {
        const { addQueue, removeQueue } = useMountedQueue()
        const fn = vi.fn()
        addQueue(fn)
        removeQueue(fn)
        return { fn }
      },
      template: '<div></div>',
    }))

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.fn).not.toHaveBeenCalled()
  })
})