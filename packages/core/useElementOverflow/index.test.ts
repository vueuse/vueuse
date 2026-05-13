import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, shallowRef } from 'vue'
import { UseElementOverflow } from './component'
import { useElementOverflow } from './index'

describe('useElementOverflow', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

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

  it('should update vertical overflow state', async () => {
    const el = document.createElement('div')
    changeDomSize(el, 'offsetHeight', 10)
    changeDomSize(el, 'scrollHeight', 50)

    const { isYOverflowed, update } = useElementOverflow(el)

    update()
    expect(isYOverflowed.value).toBe(true)
  })

  it('should not update when window is not available', async () => {
    const el = document.createElement('div')
    changeDomSize(el, 'offsetWidth', 10)
    changeDomSize(el, 'scrollWidth', 50)

    const { isXOverflowed, update } = useElementOverflow(el, { window: null as any })

    update()
    expect(isXOverflowed.value).toBe(false)
  })

  it('should ignore svg elements on mounted', async () => {
    const target = shallowRef<SVGElement | null>(null)
    const wrapper = mount({
      setup() {
        const info = useElementOverflow(target)
        return () => h('svg', { 'ref': target, 'data-overflowed': info.isXOverflowed.value })
      },
    })

    await nextTick()
    expect(wrapper.element.getAttribute('data-overflowed')).toBe('false')
  })

  it('should update and call onUpdated from resize observer', async () => {
    let resizeCallback: ResizeObserverCallback | undefined
    const onUpdated = vi.fn()
    const disconnect = vi.fn()
    const observe = vi.fn()

    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback
      }

      observe = observe
      disconnect = disconnect
    })

    const el = document.createElement('div')
    const target = shallowRef(el)
    changeDomSize(el, 'offsetWidth', 10)
    changeDomSize(el, 'scrollWidth', 50)

    const wrapper = mount({
      setup() {
        const info = useElementOverflow(target, { onUpdated })
        return () => h('div', info.isXOverflowed.value ? 'overflowed' : 'fit')
      },
    })

    await nextTick()
    resizeCallback?.([], {} as ResizeObserver)
    await nextTick()

    expect(wrapper.text()).toBe('overflowed')
    expect(onUpdated).toHaveBeenCalledOnce()

    wrapper.unmount()
    expect(disconnect).toHaveBeenCalled()
  })

  it('should update and call onUpdated from mutation observer', async () => {
    const onUpdated = vi.fn()
    const el = document.createElement('div')
    const target = shallowRef(el)
    const content = document.createTextNode('fit')
    el.appendChild(content)
    changeDomSize(el, 'offsetWidth', 10)
    changeDomSize(el, 'scrollWidth', 50)

    const wrapper = mount({
      setup() {
        const info = useElementOverflow(target, { observeMutation: true, onUpdated })
        return () => h('div', info.isXOverflowed.value ? 'overflowed' : 'fit')
      },
    })

    content.data = 'overflowed'
    await nextTick()

    expect(wrapper.text()).toBe('overflowed')
    expect(onUpdated).toHaveBeenCalled()
  })

  it('should work with component', async () => {
    const onUpdate = vi.fn()

    const wrapper = mount({
      render: () => h(UseElementOverflow, { as: 'section', observeMutation: true, onUpdate }, {
        default: ({ isXOverflowed, update }: any) => h('button', {
          'data-overflowed': isXOverflowed,
          'onClick': update,
        }, 'content'),
      }),
    })

    changeDomSize(wrapper.element, 'offsetWidth', 10)
    changeDomSize(wrapper.element, 'scrollWidth', 50)
    await wrapper.get('button').trigger('click')

    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.get('button').attributes('data-overflowed')).toBe('true')
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

function changeDomSize(el: Element, property: 'offsetWidth' | 'scrollWidth' | 'offsetHeight' | 'scrollHeight', value: number) {
  Object.defineProperty(el, property, {
    value,
    writable: true,
  })
}
