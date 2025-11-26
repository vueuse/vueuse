import { describe, expect, it, vi } from 'vitest'
import { nextTick, shallowRef } from 'vue'
import { useDraggable } from './index'

describe('useDraggable', () => {
  const Move_By_Offset = {
    x: 50,
    y: 50,
  }
  const pointerdownEvent = new PointerEvent('pointerdown', { cancelable: true, bubbles: true, clientX: 0, clientY: 0 })
  const pointermoveEvent = new PointerEvent('pointermove', { cancelable: true, bubbles: true, clientX: Move_By_Offset.x, clientY: Move_By_Offset.y })
  const pointerupEvent = new PointerEvent('pointerup', { cancelable: true, bubbles: true, clientX: 50, clientY: 50 })

  it('can be initialized', async () => {
    const elem = createElement()
    const { position, style } = useDraggable(elem, {
      initialValue: { x: 10, y: 10 },
    })

    expect(position.value).toStrictEqual({ x: 10, y: 10 })
    expect(style.value).toBe(`left:${position.value.x}px;top:${position.value.y}px;`)
  })

  it('should track element position during drag', async () => {
    const elem = createElement()
    const { position, isDragging } = useDraggable(elem)

    expect(position.value).toStrictEqual({ x: 0, y: 0 })
    expect(isDragging.value).toBe(false)

    dispatchEvent(elem, pointerdownEvent)
    expect(isDragging.value).toBe(true)

    dispatchEvent(document, pointermoveEvent)
    await nextTick()
    expect(position.value).toStrictEqual(Move_By_Offset)

    dispatchEvent(document, pointerupEvent)
    expect(isDragging.value).toBe(false)
  })

  it('should constrain to specified axis', async () => {
    const elem = createElement()
    const { x, y } = useDraggable(elem, {
      axis: 'x',
    })

    dispatchEvent(elem, pointerdownEvent)
    dispatchEvent(document, pointermoveEvent)
    await nextTick()

    expect(x.value).toBeGreaterThan(0)
    expect(y.value).toBe(0)

    dispatchEvent(document, pointerupEvent)
  })

  it('should call position callbacks with correct parameters', async () => {
    const elem = createElement()
    const onStart = vi.fn()
    const onMove = vi.fn()
    const onEnd = vi.fn()

    useDraggable(elem, {
      onStart,
      onMove,
      onEnd,
    })

    dispatchEvent(elem, pointerdownEvent)
    expect(onStart).toHaveBeenCalledWith(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }),
      expect.any(PointerEvent),
    )

    dispatchEvent(document, pointermoveEvent)
    await nextTick()
    expect(onMove).toHaveBeenCalledWith(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }),
      expect.any(PointerEvent),
    )

    dispatchEvent(document, pointerupEvent)
    expect(onEnd).toHaveBeenCalledWith(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) }),
      expect.any(PointerEvent),
    )
  })

  it('should respect container boundaries', async () => {
    const container = createElement(`
      position: fixed;
      top: 0;
      left: 0;
      width: 300px;
      height: 300px;
      overflow: hidden;
    `)
    const elem = createElement()
    container.appendChild(elem)

    const { x, y } = useDraggable(elem, {
      containerElement: container,
    })

    // Drag the element out of the container
    dispatchEvent(elem, new PointerEvent('pointerdown', {
      clientX: 0,
      clientY: 0,
      cancelable: true,
      bubbles: true,
    }))

    dispatchEvent(document, new PointerEvent('pointermove', {
      clientX: 1000,
      clientY: 1000,
      cancelable: true,
      bubbles: true,
    }))

    await nextTick()

    // 位置应该被限制在容器内
    const containerRect = container.getBoundingClientRect()
    const elemRect = elem.getBoundingClientRect()

    expect(x.value + elemRect.width).toBeLessThanOrEqual(containerRect.width)
    expect(y.value + elemRect.height).toBeLessThanOrEqual(containerRect.height)
    expect(x.value).toBeGreaterThanOrEqual(0)
    expect(y.value).toBeGreaterThanOrEqual(0)

    dispatchEvent(document, pointerupEvent)
  })

  it('should handle element position updates correctly', async () => {
    const elem = createElement()
    const { position, x, y } = useDraggable(elem, {
      initialValue: { x: 0, y: 0 },
    })

    position.value = { x: 150, y: 250 }
    await nextTick()

    expect(x.value).toBe(150)
    expect(y.value).toBe(250)

    x.value = 300
    y.value = 400
    await nextTick()

    expect(position.value).toStrictEqual({ x: 300, y: 400 })
  })

  it('should prevent dragging when onStart returns false', async () => {
    const elem = createElement()
    const onStart = vi.fn().mockReturnValue(false)
    const onMove = vi.fn()

    const { isDragging } = useDraggable(elem, {
      onStart,
      onMove,
    })

    dispatchEvent(elem, pointerdownEvent)
    expect(onStart).toHaveBeenCalled()
    expect(isDragging.value).toBe(false)

    dispatchEvent(document, pointermoveEvent)
    await nextTick()
    expect(onMove).not.toHaveBeenCalled()
  })

  it('should handle disabled state correctly', async () => {
    const elem = createElement()
    const onStart = vi.fn()
    const onMove = vi.fn()
    const { isDragging } = useDraggable(elem, {
      disabled: true,
      onStart,
      onMove,
    })

    dispatchEvent(elem, pointerdownEvent)
    expect(isDragging.value).toBe(false)
    expect(onStart).not.toHaveBeenCalled()

    dispatchEvent(document, pointermoveEvent)
    await nextTick()
    expect(isDragging.value).toBe(false)
    expect(onMove).not.toHaveBeenCalled()
  })

  it('should only be dragged using buttons that allow dragging', async () => {
    const elem = createElement()
    const allowedBtn = shallowRef([0])
    const { isDragging } = useDraggable(elem, {
      buttons: allowedBtn,
    })

    dispatchEvent(elem, new PointerEvent('pointerdown', {
      clientX: 0,
      clientY: 0,
      button: 1,
    }))
    expect(isDragging.value).toBe(false)

    allowedBtn.value = [1]
    dispatchEvent(elem, new PointerEvent('pointerdown', {
      clientX: 0,
      clientY: 0,
      button: 1,
    }))
    await nextTick()
    expect(isDragging.value).toBe(true)
  })

  it('should work with handled element', () => {
    const elem = createElement()
    const child = createElement(`
      width: 20px;
      height: 20px;
    `)
    elem.appendChild(child)

    const { isDragging } = useDraggable(elem, {
      handle: child,
    })

    // click outside of the child element
    dispatchEvent(elem, new PointerEvent('pointerdown', { clientX: 30, clientY: 30 }))
    expect(isDragging.value).toBe(false)
    dispatchEvent(elem, pointerupEvent)

    dispatchEvent(child, pointerdownEvent)
    expect(isDragging.value).toBe(true)
  })

  it('should maintain the offset after page scrolling', async () => {
    defineProperty(document, 'scrollingElement', { value: document.body })

    const elem = createElement()
    const { isDragging, position } = useDraggable(elem, {
      containerElement: document.body,
    })

    dispatchEvent(elem, pointerdownEvent)
    expect(isDragging.value).toBe(true)
    dispatchEvent(document, pointermoveEvent)

    await nextTick()
    const oldPos = position.value
    dispatchEvent(document, pointerupEvent)

    dispatchEvent(window, new CustomEvent('scroll'))
    defineProperty(document.body, 'scrollHeight', { value: 100 })
    defineProperty(document.body, 'scrollTop', { value: 100 })
    defineProperty(document.scrollingElement, 'scrollTop', { value: 100 })

    dispatchEvent(elem, pointerdownEvent)
    expect(position.value).toStrictEqual(oldPos)
  })
})

function createElement(style?: string) {
  const elem = document.createElement('div')

  elem.style = style || `
    position: fixed;
    top: 0;
    left: 0;
    width: 50px;
    height: 50px;
  `

  return elem
}

function dispatchEvent(el: HTMLElement | Window | Document, event: Event) {
  el.dispatchEvent(event)
}

function defineProperty(elem: any, key: string, description: PropertyDescriptor) {
  Object.defineProperty(elem, key, description)
}
