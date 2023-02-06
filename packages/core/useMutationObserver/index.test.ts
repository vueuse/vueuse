import { promiseTimeout } from '@vueuse/shared'
import { useMutationObserver } from './index'

describe('useMutationObserver', () => {
  it('should be defined', () => {
    expect(useMutationObserver).toBeDefined()
  })

  it('should work with attributes', async () => {
    const cb = vitest.fn()

    const target = document.createElement('div')
    target.setAttribute('id', 'header')

    useMutationObserver(target, cb, {
      attributes: true,
    })

    target.setAttribute('id', 'footer')
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(1)

    target.setAttribute('id', 'header')
    await promiseTimeout(10)

    expect(cb).toHaveBeenCalledTimes(2)
    const record = cb.mock.calls[0][0][0]
    expect(record).toBeInstanceOf(MutationRecord)
    expect(record.target).toBe(target)
  })

  it('should work with childList', async () => {
    const target = document.createElement('div')

    const cb = vitest.fn()

    useMutationObserver(target, cb, {
      childList: true,
    })

    target.appendChild(document.createElement('div'))
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalled()
  })

  it('should work with subtree', async () => {
    const target = document.createElement('div')
    const cb = vitest.fn()

    useMutationObserver(target, cb, {
      subtree: true,
      childList: true,
    })

    const child = document.createElement('div')

    target.appendChild(child)
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalled()

    child.appendChild(document.createElement('div'))
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(2)
  })

  it('should work with characterData', async () => {
    const target = document.createTextNode('123')
    const cb = vitest.fn()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    useMutationObserver(target, cb, {
      characterData: true,
    })
    target.data = 'content'

    await promiseTimeout(10)
    expect(cb).toHaveBeenCalled()

    target.data = 'footer'
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(2)
  })

  it('should work with attributeFilter', async () => {
    const target = document.createElement('div')
    const cb = vitest.fn()

    useMutationObserver(target, cb, {
      attributes: true,
      attributeFilter: ['id'],
    })

    target.setAttribute('id', 'footer')
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalled()

    target.setAttribute('class', 'footer')
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('should work with attributeOldValue', async () => {
    const target = document.createElement('div')
    const cb = vitest.fn()

    useMutationObserver(target, cb, {
      attributes: true,
      attributeOldValue: true,
    })

    target.setAttribute('id', 'footer')
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalled()

    const record = cb.mock.calls[0][0][0]
    expect(record.oldValue).toBe(null)

    target.setAttribute('id', 'header')
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(2)

    const record2 = cb.mock.calls[1][0][0]
    expect(record2.oldValue).toBe('footer')
  })

  it('should work with characterDataOldValue', async () => {
    const target = document.createTextNode('123')
    const cb = vitest.fn()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    useMutationObserver(target, cb, {
      characterData: true,
      characterDataOldValue: true,
    })

    target.data = 'content'
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalled()

    const record = cb.mock.calls[0][0][0]
    expect(record.oldValue).toBe('123')

    target.data = 'footer'
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(2)

    const record2 = cb.mock.calls[1][0][0]
    expect(record2.oldValue).toBe('content')
  })

  it('should work with stop', async () => {
    const target = document.createElement('div')
    const cb = vitest.fn()

    const { stop } = useMutationObserver(target, cb, {
      attributes: true,
    })

    target.setAttribute('id', 'footer')
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalled()

    stop()
    target.setAttribute('id', 'header')
    await promiseTimeout(10)
    expect(cb).toHaveBeenCalledTimes(1)
  })
})
