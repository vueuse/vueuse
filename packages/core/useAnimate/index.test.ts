import { shallowRef } from 'vue'
import { mount } from '@vue/test-utils'
import { useAnimate } from '.'

describe('useBluetooth', () => {
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

    expect(wrapper.vm.isSupported).toBe(false)
    expect(wrapper.vm).not.toHaveProperty('pending')
    expect(wrapper.vm).not.toHaveProperty('playState')
    expect(wrapper.vm).not.toHaveProperty('replaceState')
    expect(wrapper.vm).not.toHaveProperty('startTime')
    expect(wrapper.vm).not.toHaveProperty('currentTime')
    expect(wrapper.vm).not.toHaveProperty('timeline')
    expect(wrapper.vm).not.toHaveProperty('playbackRate')
  })

  it('set reactive option', () => {
    const wrapper = mount({
      template: '<p ref="el">test</p>',
      setup() {
        const el = shallowRef<HTMLElement>()
        const animate = useAnimate(el, { transform: 'rotate(360deg)' }, { reactive: true, duration: 100 })

        return { ...animate, el }
      },
    })

    expect(wrapper.vm.isSupported).toBe(false)
    expect(wrapper.vm.pending).toBeDefined()
    expect(wrapper.vm.playState).toBeDefined()
    expect(wrapper.vm.replaceState).toBeDefined()
    expect(wrapper.vm.startTime).toBeDefined()
    expect(wrapper.vm.currentTime).toBeDefined()
    expect(wrapper.vm.timeline).toBeDefined()
    expect(wrapper.vm.playbackRate).toBeDefined()
  })
})
