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
