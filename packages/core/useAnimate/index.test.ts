import { shallowRef } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useAnimate } from '.'

describe('useAnimate', () => {
  it('should be defined', () => {
    expect(useAnimate).toBeDefined()
  })

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

    expect(vm.isSupported).toBe(false)
    wrapper.unmount()
  })
})
