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
    const vm = wrapper.vm

    expect(vm.isSupported).toBe(false)
    expect(vm).not.toHaveProperty('pending')
    expect(vm).not.toHaveProperty('playState')
    expect(vm).not.toHaveProperty('replaceState')
    expect(vm).not.toHaveProperty('startTime')
    expect(vm).not.toHaveProperty('currentTime')
    expect(vm).not.toHaveProperty('timeline')
    expect(vm).not.toHaveProperty('playbackRate')

    wrapper.unmount()
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
    const vm = wrapper.vm

    expect(vm.isSupported).toBe(false)
    expect(vm.pending).toBeDefined()
    expect(vm.playState).toBeDefined()
    expect(vm.replaceState).toBeDefined()
    expect(vm.startTime).toBeDefined()
    expect(vm.currentTime).toBeDefined()
    expect(vm.timeline).toBeDefined()
    expect(vm.playbackRate).toBeDefined()

    wrapper.unmount()
  })
})
