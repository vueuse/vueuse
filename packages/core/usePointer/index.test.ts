import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, useTemplateRef } from 'vue'
import { usePointer } from './index'

describe('usePointer', () => {
  it('sets isInside true on pointerdown and resets it on pointercancel', async () => {
    const wrapper = mount({
      setup() {
        const el = useTemplateRef<HTMLElement>('el')
        const { isInside } = usePointer({ target: el })

        return () => h('div', {
          'data-inside': isInside.value,
          'ref': 'el',
        })
      },
    })

    await nextTick()
    const element = wrapper.get('div').element

    expect(wrapper.get('div').attributes('data-inside')).toBe('false')

    element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await nextTick()
    expect(wrapper.get('div').attributes('data-inside')).toBe('true')

    // the user agent takes the gesture over (e.g. a second pointer starting a
    // pinch), firing pointercancel without pointerleave reaching the element
    element.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true }))
    await nextTick()
    expect(wrapper.get('div').attributes('data-inside')).toBe('false')
  })

  it('resets isInside on pointerleave', async () => {
    const wrapper = mount({
      setup() {
        const el = useTemplateRef<HTMLElement>('el')
        const { isInside } = usePointer({ target: el })

        return () => h('div', {
          'data-inside': isInside.value,
          'ref': 'el',
        })
      },
    })

    await nextTick()
    const element = wrapper.get('div').element

    element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await nextTick()
    expect(wrapper.get('div').attributes('data-inside')).toBe('true')

    element.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }))
    await nextTick()
    expect(wrapper.get('div').attributes('data-inside')).toBe('false')
  })
})
