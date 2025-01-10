import { mount } from '@vue/test-utils'
import { useAnimate } from '@vueuse/core'
import { describe, expect, it, vi } from 'vitest'
import { shallowRef } from 'vue'
// import { useAnimate } from '.'

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
})
