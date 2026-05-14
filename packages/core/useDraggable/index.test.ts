import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, useTemplateRef } from 'vue'
import { UseDraggable } from './component'
import { useDraggable } from './index'

describe('useDraggable', () => {
  it('basic functionality', async () => {
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
        expect(isDragging.value).toBe(false)

        return () => h('div', {
          'data-is-dragging': isDragging.value,
          'ref': 'el',
          'style': style.value,
        })
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

  it('passes the current position to onStart', async () => {
    const initialValue = { x: 40, y: 50 }
    const onStart = vi.fn()
    const onMove = vi.fn()

    const wrapper = mount({
      setup() {
        const el = useTemplateRef<HTMLElement>('el')

        const { style } = useDraggable(el, {
          initialValue,
          onStart,
          onMove,
        })

        return () => h('div', {
          ref: 'el',
          style: style.value,
        })
      },
    })

    await nextTick()

    const el = wrapper.get('div').element
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
      bottom: 60,
      height: 10,
      left: initialValue.x,
      right: 50,
      top: initialValue.y,
      width: 10,
      x: initialValue.x,
      y: initialValue.y,
      toJSON: () => undefined,
    })

    el.dispatchEvent(new PointerEvent('pointerdown', {
      clientX: 45,
      clientY: 65,
    }))
    await nextTick()

    window.dispatchEvent(new PointerEvent('pointermove', {
      clientX: 55,
      clientY: 75,
    }))
    await nextTick()

    expect(onStart.mock.calls[0][0]).toEqual(initialValue)
    expect(onMove.mock.calls[0][0]).toEqual({ x: 50, y: 60 })
  })

  it('component', async () => {
    const onStart = vi.fn()
    const onMove = vi.fn()
    const onEnd = vi.fn()

    const wrapper = mount({
      render: () => h(UseDraggable, { as: 'form', onStart, onMove, onEnd }, {
        default: ({ isDragging, x, y }: any) => h('div', {
          'id': 'content',
          'data-is-dragging': isDragging,
          'data-x': x,
          'data-y': y,
        }),
      }),
    })

    expect(wrapper.element.tagName).toBe('FORM')

    await nextTick()
    expect(wrapper.get('div').element.getAttribute('data-x')).toBe('0')
    expect(wrapper.get('div').element.getAttribute('data-y')).toBe('0')
    expect(wrapper.get('div').element.getAttribute('data-is-dragging')).toBe('false')

    wrapper.get('div').element.dispatchEvent(new PointerEvent('pointerdown', {
      clientX: 0,
      clientY: 0,
    }))
    await nextTick()
    expect(wrapper.get('div').element.getAttribute('data-is-dragging')).toBe('true')
    expect(wrapper.get('div').element.getAttribute('data-x')).toBe('0')
    expect(wrapper.get('div').element.getAttribute('data-y')).toBe('0')

    window.dispatchEvent(new PointerEvent('pointermove', {
      clientX: 10,
      clientY: 20,
    }))
    await nextTick()
    expect(wrapper.get('div').element.getAttribute('data-is-dragging')).toBe('true')
    expect(wrapper.get('div').element.getAttribute('data-x')).toBe('10')
    expect(wrapper.get('div').element.getAttribute('data-y')).toBe('20')

    window.dispatchEvent(new PointerEvent('pointerup'))
    await nextTick()
    expect(wrapper.get('div').element.getAttribute('data-is-dragging')).toBe('false')
    expect(onStart).toHaveBeenCalledOnce()
    expect(onMove).toHaveBeenCalledOnce()
    expect(onEnd).toHaveBeenCalledOnce()
  })
})
