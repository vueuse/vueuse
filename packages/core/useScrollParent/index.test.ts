import { describe, expect, it, vi } from 'vitest'
import { nextTick, shallowRef } from 'vue'
import { useScrollParent } from './index'

describe('useScrollParent', () => {
  const fallback = document.scrollingElement || document.documentElement

  it('should be defined', () => {
    expect(useScrollParent).toBeDefined()
  })

  it('should return nearest vertical scrollable parent', async () => {
    const parent = document.createElement('div')
    const child = document.createElement('div')
    parent.style.overflowY = 'auto'
    parent.appendChild(child)
    document.body.appendChild(parent)

    const target = shallowRef<HTMLElement | null>(child)
    const result = useScrollParent(target)

    await nextTick()
    expect(result.value.y).toBe(parent)
    expect(result.value.x).toBe(null)
  })

  it('should return nearest horizontal scrollable parent', async () => {
    const parent = document.createElement('div')
    const child = document.createElement('div')
    parent.style.overflowX = 'auto'
    parent.appendChild(child)
    document.body.appendChild(parent)

    const target = shallowRef<HTMLElement | null>(child)
    const result = useScrollParent(target)

    await nextTick()
    expect(result.value.x).toBe(parent)
    expect(result.value.y).toBe(null)
  })

  it('should return overflow-hidden parent', async () => {
    const parent = document.createElement('div')
    const child = document.createElement('div')
    parent.style.overflowY = 'hidden'
    parent.appendChild(child)
    document.body.appendChild(parent)

    const target = shallowRef<HTMLElement | null>(child)
    const normalResult = useScrollParent(target)
    const includeResult = useScrollParent(target, { includeHidden: true })

    await nextTick()
    expect(normalResult.value.y).toBe(fallback)
    expect(includeResult.value.y).toBe(parent)
  })

  it('should return fallback when element is position fixed', async () => {
    const parent = document.createElement('div')
    const child = document.createElement('div')
    child.style.position = 'fixed'
    parent.style.overflowY = 'auto'
    parent.appendChild(child)
    document.body.appendChild(parent)

    const target = shallowRef<HTMLElement | null>(child)
    const normalResult = useScrollParent(target)

    await nextTick()
    expect(normalResult.value.y).toBe(fallback)
  })

  it('should return non-static positioned scrollable parent element when element is position absolute', async () => {
    const noStaticWrapper = document.createElement('div')
    const parent = document.createElement('div')
    const child = document.createElement('div')
    child.style.position = 'absolute'
    parent.style.overflowY = 'auto'
    parent.style.position = 'static'
    noStaticWrapper.style.position = 'relative'
    noStaticWrapper.style.overflowY = 'auto'
    parent.appendChild(child)
    noStaticWrapper.appendChild(parent)
    document.body.appendChild(noStaticWrapper)

    const target = shallowRef<HTMLElement | null>(child)
    const normalResult = useScrollParent(target)

    await nextTick()
    expect(normalResult.value.y).toBe(noStaticWrapper)
  })

  it('should return fallback when no scrollable parent', async () => {
    const node = document.createElement('div')
    document.body.appendChild(node)

    const target = shallowRef<HTMLElement | null>(node)
    const result = useScrollParent(target)

    await nextTick()
    expect(result.value.y).toBe(fallback)
    expect(result.value.x).toBe(fallback)
  })

  it('should respect lookupLevel limit', async () => {
    const scrollable = document.createElement('div')
    scrollable.style.overflowY = 'auto'

    let wrapper = scrollable
    for (let i = 0; i < 10; i++) {
      const child = document.createElement('div')
      wrapper.appendChild(child)
      wrapper = child
    }

    const target = shallowRef<HTMLElement | null>(wrapper)
    const overLimit = useScrollParent(target, { lookupLevel: 5 })
    const normal = useScrollParent(target, { lookupLevel: 15 })

    await nextTick()
    expect(overLimit.value.y).toBe(fallback)
    expect(normal.value.y).toBe(scrollable)
  })

  it('should call onError when an error occurs', async () => {
    const errorSpy = vi.fn()

    const target: any = shallowRef('not-an-element')

    const result = useScrollParent(target, {
      onError: errorSpy,
    })

    await nextTick()
    expect(result.value.x).toBe(null)
    expect(result.value.y).toBe(null)
    expect(errorSpy).toHaveBeenCalledOnce()
  })

  it('should return null when element is null', async () => {
    const target = shallowRef<HTMLElement | null>(null)
    const result = useScrollParent(target)

    await nextTick()
    expect(result.value.x).toBe(null)
    expect(result.value.y).toBe(null)
  })
})
