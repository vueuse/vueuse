import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { UseWindowFocus } from './component'
import { useWindowFocus } from './index'

describe('useWindowFocus', () => {
  it('should be defined', () => {
    expect(useWindowFocus).toBeDefined()
  })

  it('should work with event triggers', () => {
    const focused = useWindowFocus()
    expect(focused.value).toBeFalsy()

    window.dispatchEvent(new Event('focus'))
    expect(focused.value).toBeTruthy()

    window.dispatchEvent(new Event('blur'))
    expect(focused.value).toBeFalsy()
  })

  describe.sequential('should work with component', async () => {
    const wrapper = mount({
      render: () =>
        h(UseWindowFocus, {}, {
          default: ({ focused }: { focused: boolean }) => h('span', focused),
        }),
    })

    it('should be false with initial', async () => {
      await nextTick()
      expect(wrapper.text()).toContain('false')
    })

    it('should be true with trigger focus event', async () => {
      window.dispatchEvent(new Event('focus'))
      await nextTick()
      expect(wrapper.text()).toContain('true')
    })

    it('should be false with trigger blur event', async () => {
      window.dispatchEvent(new Event('blur'))
      await nextTick()
      expect(wrapper.text()).toContain('false')
    })
  })
})
