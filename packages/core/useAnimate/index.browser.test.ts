import { flushPromises, mount } from '@vue/test-utils'
import { useAnimate } from '@vueuse/core'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, shallowRef } from 'vue'
// import { useAnimate } from './index'

describe('useAnimate', () => {
  it('browser should support useAnimate', () => {
    const wrapper = mount(defineComponent({
      template: '<p ref="el">test</p>',
      setup() {
        const el = shallowRef<HTMLElement>()
        const animate = useAnimate(el, { transform: 'rotate(360deg)' }, 100)

        return { ...animate, el }
      },
    }))
    const vm = wrapper.vm

    expect(vm.isSupported).toBe(true)
    wrapper.unmount()
  })

  it('should be running', async () => {
    const wrapper = mount(defineComponent({
      template: '<p ref="el">test</p>',
      setup() {
        const el = shallowRef<HTMLElement>()
        const animate = useAnimate(el, { transform: 'rotate(360deg)' }, 100)

        return { ...animate, el }
      },
    }))
    const vm = wrapper.vm
    await vi.waitFor(() => {
      expect(vm.playState).toBe('running')
    })
    wrapper.unmount()
  })

  it('should support keyframes refs', async () => {
    const keyframes = shallowRef<PropertyIndexedKeyframes>({
      transform: 'rotate(360deg)',
    })
    const wrapper = mount(defineComponent({
      template: '<p ref="el">test</p>',
      setup() {
        const el = shallowRef<HTMLElement>()
        const animate = useAnimate(el, keyframes, 100)

        return { ...animate, el }
      },
    }))
    const vm = wrapper.vm
    await vi.waitFor(() => {
      expect(vm.playState).toBe('finished')
    })

    keyframes.value = { transform: 'rotate(180deg)' }

    const animation = vm.animate!

    await vi.waitFor(() => {
      const keyframe = animation.effect as KeyframeEffect
      expect(keyframe.getKeyframes()).to.deep.equal([{
        composite: 'auto',
        computedOffset: 1,
        easing: 'linear',
        offset: null,
        transform: 'rotate(180deg)',
      }])
    })

    wrapper.unmount()
  })

  it('should not automatically start the animation when shown if `immediate` is false', async () => {
    const wrapper = mount(defineComponent({
      template: '<p v-if="show" ref="el">test</p>',
      setup() {
        const show = shallowRef(false)
        const el = shallowRef<HTMLElement>()
        const animate = useAnimate(el, { transform: 'rotate(360deg)' }, {
          duration: 100,
          immediate: false,
        })

        return { ...animate, el, show }
      },
    }))

    const vm = wrapper.vm

    // It is initially hidden
    expect(vm.animate).toBeUndefined()

    // Toggle element into view
    vm.show = true
    await flushPromises()

    // It should not have started automatically
    expect(vm.animate?.playState).toBe('paused')

    wrapper.unmount()
  })
})
