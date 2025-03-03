import { mount } from '@vue/test-utils'
import { useAnimate } from '@vueuse/core'
import { describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
// import { useAnimate } from './index'

describe('useAnimate', () => {
  it('browser should support useAnimate', () => {
    const wrapper = mount({
      template: '<p ref="el">test</p>',
      setup() {
        const el = shallowRef<HTMLElement>()
        const animate = useAnimate(el, { transform: 'rotate(360deg)' }, 100)

        return { ...animate, el }
      },
    })
    const vm = wrapper.vm

    expect(vm.isSupported).toBe(true)
    wrapper.unmount()
  })

  it('should be running', async () => {
    const wrapper = mount({
      template: '<p ref="el">test</p>',
      setup() {
        const el = shallowRef<HTMLElement>()
        const animate = useAnimate(el, { transform: 'rotate(360deg)' }, 100)

        return { ...animate, el }
      },
    })
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
    const wrapper = mount({
      template: '<p ref="el">test</p>',
      setup() {
        const el = shallowRef<HTMLElement>()
        const animate = useAnimate(el, keyframes, 100)

        return { ...animate, el }
      },
    })
    const vm = wrapper.vm
    await vi.waitFor(() => {
      expect(vm.playState).toBe('finished')
    })

    keyframes.value = { transform: 'rotate(180deg)' }

    // TODO (43081j): figure out how to get `mount` to type this properly
    // in the first place. So we can drop the cast
    const animation = vm.animate as Animation

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
})
