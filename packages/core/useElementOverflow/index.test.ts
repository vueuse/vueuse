import { describe, expect, it } from 'vitest'
import { useElementOverflow } from './index'

describe('useElementOverflow', () => {
  it('should be defined', () => {
    expect(useElementOverflow).toBeDefined()
  })

  it('should work when el is not an element', async () => {
    const { isXOverflowed, isYOverflowed } = useElementOverflow(null)
    expect(isXOverflowed.value).toBeFalsy()
    expect(isYOverflowed.value).toBeFalsy()
  })

  it('should update overflow state when container\'s size ', async () => {
    // set container's size
    const el = document.createElement('div')
    document.body.appendChild(el)
    changeDomWidth(el, 'width', 100)
    changeDomWidth(el, 'offsetWidth', 100)
    changeDomWidth(el, 'scrollWidth', 100)
    // set content's size
    const content = document.createElement('div')
    changeDomWidth(content, 'width', 50)
    el.appendChild(content)

    const { isXOverflowed, update } = useElementOverflow(el)

    expect(isXOverflowed.value).toBe(false)

    // update container's size
    changeDomWidth(el, 'width', 10)
    changeDomWidth(el, 'offsetWidth', 10)
    changeDomWidth(el, 'scrollWidth', 50)
    update()
    expect(isXOverflowed.value).toBe(true)
    document.body.removeChild(el)
  })

  it('should update overflow state when content changed', async () => {
    // set container's size
    const el = document.createElement('div')
    document.body.appendChild(el)
    changeDomWidth(el, 'width', 100)
    changeDomWidth(el, 'offsetWidth', 100)
    changeDomWidth(el, 'scrollWidth', 100)
    const content = document.createElement('div')
    el.appendChild(content)

    const { isXOverflowed, update } = useElementOverflow(el, { observeMutation: true })

    // update content's size
    changeDomWidth(content, 'width', 200)
    changeDomWidth(el, 'scrollWidth', 200)
    update()
    expect(isXOverflowed.value).toBe(true)
    document.body.removeChild(el)
  })
})

function changeDomWidth(el: HTMLDivElement, property: 'width' | 'offsetWidth' | 'scrollWidth', value: number) {
  if (property === 'width') {
    el.style.width = `${value}px`
    return
  }
  Object.defineProperty(el, property, {
    value,
    writable: true,
  })
}
