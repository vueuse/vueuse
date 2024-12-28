import { mount } from '@vue/test-utils'
import { useAnimate } from '@vueuse/core'
import { describe, expect, it } from 'vitest'
import { shallowRef } from 'vue'
// import { useAnimate } from '.'

describe('useAnimate', () => {
  it('the test environment does not support animate', () => {
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
})
