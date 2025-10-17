import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useMouseInElement } from './index'

function createElement(x: number, y: number, width: number, height: number) {
  const div = document.createElement('div')
  div.style.position = 'relative'
  div.style.left = `${x}px`
  div.style.top = `${y}px`
  div.style.width = `${width}px`
  div.style.height = `${height}px`

  document.body.appendChild(div)
  return div
}

function createInlineElement(x: number, y: number) {
  const parent = createElement(0, 0, 50, 50)
  const span = document.createElement('span')
  span.style.position = 'relative'
  span.style.left = `${x}px`
  span.style.top = `${y}px`
  span.style.lineHeight = '2'
  span.textContent = 'Hello World'

  parent.appendChild(span)
  return span
}

function mockMouseMoveEvent(x: number, y: number) {
  return new MouseEvent('mousemove', { clientX: x, clientY: y })
}

describe('useMouseInElement', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('basic usage - block element', async () => {
    const x = 10
    const y = 10
    const width = 100
    const height = 100
    const target = createElement(x, y, width, height)

    // `x`, `y`, `sourceType` are not tested in this file, because they are re-export from `useMouse`.
    const result = useMouseInElement(target)

    expect(result.elementWidth.value).toBe(width)
    expect(result.elementHeight.value).toBe(height)
    expect(result.elementPositionX.value).toBe(x)
    expect(result.elementPositionY.value).toBe(y)
    expect(result.elementX.value).toBe(-x)
    expect(result.elementY.value).toBe(-y)
    expect(result.isOutside.value).toBe(true)

    const moveX = 20
    const moveY = 20
    dispatchEvent(mockMouseMoveEvent(moveX, moveY))
    await nextTick()

    expect(result.elementX.value).toBe(moveX - x)
    expect(result.elementY.value).toBe(moveY - y)
    expect(result.isOutside.value).toBe(false)

    result.stop()
    dispatchEvent(mockMouseMoveEvent(0, 0))
    await nextTick()

    expect(result.elementX.value).toBe(moveX - x)
    expect(result.elementY.value).toBe(moveY - y)
    expect(result.isOutside.value).toBe(false)
  })

  it('basic usage - inline element', async () => {
    const target = createInlineElement(5, 0)
    const result = useMouseInElement(target)
    expect(result.isOutside.value).toBe(true)

    // move to first line - `Hello`
    dispatchEvent(mockMouseMoveEvent(10, 10))
    await nextTick()
    expect(result.isOutside.value).toBe(false)

    // move to gap
    dispatchEvent(mockMouseMoveEvent(10, 30))
    await nextTick()
    expect(result.isOutside.value).toBe(true)

    // move to second line - `World`
    dispatchEvent(mockMouseMoveEvent(10, 40))
    await nextTick()
    expect(result.isOutside.value).toBe(false)

    // move out
    dispatchEvent(mockMouseMoveEvent(10, 80))
    await nextTick()
    expect(result.isOutside.value).toBe(true)
  })
})
