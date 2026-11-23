import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, isReadonly, nextTick, shallowRef, useTemplateRef } from 'vue'
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

  describe('state', () => {
    const target = document.createElement('div')
    const pointerdown = (init: PointerEventInit) => target.dispatchEvent(new PointerEvent('pointerdown', init))

    it('should return readonly refs', () => {
      const pointer = usePointer({ target })

      expect(isReadonly(pointer.x)).toBe(true)
      expect(isReadonly(pointer.pointerType)).toBe(true)
      expect(isReadonly(pointer.isInside)).toBe(true)
    })

    it('should update from pointer events', () => {
      const { x, y, pressure, pointerType } = usePointer({ target })

      pointerdown({ clientX: 10, clientY: 20, pressure: 0.5, pointerType: 'pen' })

      expect([x.value, y.value, pressure.value, pointerType.value]).toEqual([10, 20, 0.5, 'pen'])
    })
  })

  describe('initials', () => {
    const target = document.createElement('div')
    const pointerdown = (init: PointerEventInit) => target.dispatchEvent(new PointerEvent('pointerdown', init))

    it('should default to 0 and null', () => {
      const { x, pressure, pointerType } = usePointer({ target })

      expect([x.value, pressure.value, pointerType.value]).toEqual([0, 0, null])
    })

    it('should seed from plain values', () => {
      const { x, y, pointerType } = usePointer({ target, initials: { x: 1, pointerType: 'mouse' } })

      expect([x.value, y.value, pointerType.value]).toEqual([1, 0, 'mouse'])
    })

    it('should use passed refs as internal state', () => {
      const x = shallowRef(1)
      const pointer = usePointer({ target, initials: { x } })

      expect(pointer.x).not.toBe(x)

      pointerdown({ clientX: 10 })
      expect(x.value).toBe(10)

      x.value = 42
      expect(pointer.x.value).toBe(42)
    })

    it('should seed isInside', () => {
      const isInside = shallowRef(true)
      const pointer = usePointer({ target, initials: { isInside } })

      expect(pointer.isInside.value).toBe(true)

      target.dispatchEvent(new PointerEvent('pointerleave'))
      expect(isInside.value).toBe(false)
    })

    it('should not copy isInside from the pointer event', () => {
      const { isInside } = usePointer({ target, initials: { isInside: false } })

      pointerdown({ clientX: 10 })
      expect(isInside.value).toBe(true)
    })

    it('should keep an explicit null over the deprecated initialValue', () => {
      const { pointerType } = usePointer({ target, initialValue: { pointerType: 'pen' }, initials: { pointerType: null } })

      expect(pointerType.value).toBe(null)
    })

    it('should support deprecated initialValue', () => {
      const { x, y } = usePointer({ target, initialValue: { x: 1, y: 2 } })

      expect([x.value, y.value]).toEqual([1, 2])
    })

    it('should keep updating a ref passed to the deprecated initialValue', () => {
      const initialValue = shallowRef({ x: 1 })
      const { x } = usePointer({ target, initialValue })

      expect(x.value).toBe(1)

      pointerdown({ clientX: 10 })
      expect(x.value).toBe(10)
      expect(initialValue.value.x).toBe(10)
    })

    it('should prefer initials over deprecated initialValue', () => {
      const { x, y } = usePointer({ target, initialValue: { x: 1, y: 2 }, initials: { x: 3 } })

      expect([x.value, y.value]).toEqual([3, 2])
    })
  })
})
