import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, useTemplateRef } from 'vue'
import { useDraggable } from './index'

describe('useDraggable', () => {
  it('should be defined', async () => {
    const onStart = vi.fn()
    const onMove = vi.fn()
    const onEnd = vi.fn()

    const wrapper = mount({
      setup() {
        const el = useTemplateRef<HTMLElement>('el')

        const { x, y, style, isDragging } = useDraggable(el, {
          preventDefault: true,
          onMove,
          onEnd,
          onStart,
        })

        expect(x.value).toBe(0)
        expect(y.value).toBe(0)

        return () => h('div', {
          'data-is-dragging': isDragging.value,
          'ref': 'el',
          'style': style.value,
        }, 'Drag me!')
      },
    })

    await nextTick()
    expect(wrapper.get('div').element.style.left).toBe('0px')
    expect(wrapper.get('div').element.style.top).toBe('0px')
    expect(wrapper.get('div').element.dataset.isDragging).toBe('false')
    expect(onStart).not.toBeCalled()
    expect(onMove).not.toBeCalled()
    expect(onEnd).not.toBeCalled()

    wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', {
      clientX: 0,
      clientY: 0,
    }))
    await nextTick()
    expect(onStart).toHaveBeenCalledOnce()
    expect(onMove).not.toBeCalled()
    expect(onEnd).not.toBeCalled()
    expect(wrapper.get('div').element.dataset.isDragging).toBe('true')

    window.dispatchEvent(new PointerEvent('pointermove', {
      clientX: 10,
      clientY: 20,
    }))
    await nextTick()
    expect(onMove).toHaveBeenCalledOnce()
    expect(onEnd).not.toBeCalled()
    expect(wrapper.get('div').element.style.left).toBe('10px')
    expect(wrapper.get('div').element.style.top).toBe('20px')
    expect(wrapper.get('div').element.dataset.isDragging).toBe('true')

    window.dispatchEvent(new PointerEvent('pointerup'))
    await nextTick()
    expect(onEnd).toHaveBeenCalledOnce()
    expect(wrapper.get('div').element.style.left).toBe('10px')
    expect(wrapper.get('div').element.style.top).toBe('20px')
    expect(wrapper.get('div').element.dataset.isDragging).toBe('false')
  })
})
