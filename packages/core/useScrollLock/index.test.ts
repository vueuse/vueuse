import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { useScrollLock } from '.'
import { mount } from '../../.test'

describe('useScrollLock', () => {
  let targetEl: HTMLElement

  beforeEach(() => {
    targetEl = document.createElement('div')
  })

  it('should lock the scroll', () => {
    const isLock = useScrollLock(targetEl)

    isLock.value = true
    expect(targetEl.style.overflow).toBe('hidden')

    isLock.value = false
    expect(targetEl.style.overflow).toBe('')
  })

  it('should cache the initial overflow setting', () => {
    targetEl.style.overflow = 'auto'

    const isLock = useScrollLock(targetEl)

    isLock.value = true
    expect(targetEl.style.overflow).toBe('hidden')

    isLock.value = false
    expect(targetEl.style.overflow).toBe('auto')
  })

  it('automatically unlocks on component unmount', async () => {
    const vm = mount(defineComponent({
      setup() {
        const isLock = useScrollLock(targetEl)

        return { isLock }
      },
      render() {
        return h('div')
      },
    }))

    vm.isLock = true
    expect(targetEl.style.overflow).toBe('hidden')

    vm.unmount()
    expect(targetEl.style.overflow).toBe('')
  })

  it('handles touchmove event on IOS devices', () => {
    vi.mock('@vueuse/shared', async () => {
      const actual = await vi.importActual('@vueuse/shared')
      return {
        ...actual,
        isIOS: true,
      }
    })

    const addEventListener = vi.spyOn(targetEl, 'addEventListener')
    const removeEventListener = vi.spyOn(targetEl, 'removeEventListener')
    const isLock = useScrollLock(targetEl)

    expect(addEventListener).toBeCalledTimes(0)

    isLock.value = true
    expect(addEventListener).toBeCalledTimes(1)
    expect(removeEventListener).toBeCalledTimes(0)

    isLock.value = false
    expect(removeEventListener).toBeCalledTimes(1)
  })

  it('multiple instances point at the same element, will share the same initialOverflow', () => {
    const isLock1 = useScrollLock(targetEl)
    const isLock2 = useScrollLock(targetEl)

    isLock1.value = true
    isLock2.value = true
    expect(targetEl.style.overflow).toBe('hidden')

    isLock2.value = false
    expect(targetEl.style.overflow).toBe('')
  })
})
