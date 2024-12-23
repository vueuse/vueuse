import { describe, expect, it, vi } from 'vitest'
import { computed, nextTick, ref } from 'vue'
import { useMutationObserver } from '.'

describe('useMutationObserver', () => {
  it('should be defined', () => {
    expect(useMutationObserver).toBeDefined()
  })

  it('should work with attributes', async () => {
    const cb = vi.fn()

    const target = document.createElement('div')
    target.setAttribute('id', 'header')

    useMutationObserver(target, cb, {
      attributes: true,
    })

    target.setAttribute('id', 'footer')
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(1)

    target.setAttribute('id', 'header')
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(2)
    const record = cb.mock.calls[0][0][0]
    expect(record).toBeInstanceOf(MutationRecord)
    expect(record.target).toBe(target)
  })

  it('should work with childList', async () => {
    const target = document.createElement('div')

    const cb = vi.fn()

    useMutationObserver(target, cb, {
      childList: true,
    })

    target.appendChild(document.createElement('div'))
    await nextTick()
    expect(cb).toHaveBeenCalled()
  })

  it('should work with subtree', async () => {
    const target = document.createElement('div')
    const cb = vi.fn()

    useMutationObserver(target, cb, {
      subtree: true,
      childList: true,
    })

    const child = document.createElement('div')

    target.appendChild(child)
    await nextTick()
    expect(cb).toHaveBeenCalled()

    child.appendChild(document.createElement('div'))
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(2)
  })

  it('should work with characterData', async () => {
    const target = document.createTextNode('123')
    const cb = vi.fn()
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    useMutationObserver(target, cb, {
      characterData: true,
    })
    target.data = 'content'

    await nextTick()
    expect(cb).toHaveBeenCalled()

    target.data = 'footer'
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(2)
  })

  it('should work with attributeFilter', async () => {
    const target = document.createElement('div')
    const cb = vi.fn()

    useMutationObserver(target, cb, {
      attributes: true,
      attributeFilter: ['id'],
    })

    target.setAttribute('id', 'footer')
    await nextTick()
    expect(cb).toHaveBeenCalled()

    target.setAttribute('class', 'footer')
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('should work with attributeOldValue', async () => {
    const target = document.createElement('div')
    const cb = vi.fn()

    useMutationObserver(target, cb, {
      attributes: true,
      attributeOldValue: true,
    })

    target.setAttribute('id', 'footer')
    await nextTick()
    expect(cb).toHaveBeenCalled()

    const record = cb.mock.calls[0][0][0]
    expect(record.oldValue).toBe(null)

    target.setAttribute('id', 'header')
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(2)

    const record2 = cb.mock.calls[1][0][0]
    expect(record2.oldValue).toBe('footer')
  })

  it('should work with characterDataOldValue', async () => {
    const target = document.createTextNode('123')
    const cb = vi.fn()
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    useMutationObserver(target, cb, {
      characterData: true,
      characterDataOldValue: true,
    })

    target.data = 'content'
    await nextTick()
    expect(cb).toHaveBeenCalled()

    const record = cb.mock.calls[0][0][0]
    expect(record.oldValue).toBe('123')

    target.data = 'footer'
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(2)

    const record2 = cb.mock.calls[1][0][0]
    expect(record2.oldValue).toBe('content')
  })

  it('should work with stop', async () => {
    const target = document.createElement('div')
    const cb = vi.fn()

    const { stop } = useMutationObserver(target, cb, {
      attributes: true,
    })

    target.setAttribute('id', 'footer')
    await nextTick()
    expect(cb).toHaveBeenCalled()

    stop()
    target.setAttribute('id', 'header')
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('should work with takeRecords', async () => {
    const target = document.createElement('div')
    const cb = vi.fn()

    const { takeRecords } = useMutationObserver(target, cb, {
      attributes: true,
    })

    target.setAttribute('id', 'footer')
    await nextTick()
    expect(cb).toHaveBeenCalledTimes(1)

    target.setAttribute('id', 'header')
    const records = takeRecords()

    await nextTick()
    expect(records).toHaveLength(1)
    expect(records![0].target).toBe(target)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('should work with multiple targets', async () => {
    const headerElement = ref<HTMLDivElement | null>(
      document.createElement('div'),
    )
    const footerElement = ref<HTMLDivElement | null>(
      document.createElement('div'),
    )
    const targets = computed(() => [headerElement.value, footerElement.value])
    const cb = vi.fn()

    const { takeRecords } = useMutationObserver(targets, cb, {
      attributes: true,
    })

    headerElement.value?.setAttribute('id', 'header')
    footerElement.value?.setAttribute('id', 'footer')
    let records = takeRecords()
    await nextTick()
    expect(records).toHaveLength(2)
    expect(records![0].target).toBe(headerElement.value)
    expect(records![1].target).toBe(footerElement.value)

    headerElement.value = null
    footerElement.value?.removeAttribute('id')
    records = takeRecords()
    await nextTick()
    expect(records).toHaveLength(1)
    expect(records![0].target).toBe(footerElement.value)
  })
})
