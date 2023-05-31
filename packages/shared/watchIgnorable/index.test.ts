import { nextTick, ref } from 'vue-demi'
import { describe, expect, it, vi } from 'vitest'
import { ignorableWatch, watchIgnorable } from '.'

describe('watchIgnorable', () => {
  it('export module', () => {
    expect(watchIgnorable).toBeDefined()
    expect(ignorableWatch).toBeDefined()
  })

  it('ignore async updates', async () => {
    const source = ref(0)
    const target = ref(0)
    const { ignoreUpdates } = watchIgnorable(source, value => target.value = value)

    source.value = 1

    await nextTick()
    expect(target.value).toBe(1)

    ignoreUpdates(() => {
      source.value = 2
      source.value = 3
    })

    await nextTick()
    expect(target.value).toBe(1)

    ignoreUpdates(() => {
      source.value = 4
    })
    source.value = 5

    await nextTick()
    expect(target.value).toBe(5)
  })

  it('ignore prev async updates', async () => {
    const source = ref(0)
    const target = ref(0)
    const { ignorePrevAsyncUpdates } = watchIgnorable(source, value => target.value = value)

    source.value = 1

    await nextTick()
    expect(target.value).toBe(1)

    source.value = 2
    source.value = 3
    ignorePrevAsyncUpdates()

    await nextTick()
    expect(target.value).toBe(1)

    source.value = 4
    ignorePrevAsyncUpdates()
    source.value = 5

    await nextTick()
    expect(target.value).toBe(5)
  })

  it('ignore sync updates', () => {
    const source = ref(0)
    const target = ref(0)
    const { ignoreUpdates, ignorePrevAsyncUpdates } = watchIgnorable(source, value => target.value = value, { flush: 'sync' })

    source.value = 1

    expect(target.value).toBe(1)

    ignoreUpdates(() => {
      source.value = 2
      source.value = 3
    })

    expect(target.value).toBe(1)

    ignoreUpdates(() => {
      source.value = 4
    })

    source.value = 5

    ignorePrevAsyncUpdates()

    expect(target.value).toBe(5)
  })

  it('stop watch', async () => {
    const source = ref(0)
    const callback = vi.fn()
    const { stop } = watchIgnorable(source, callback)

    source.value = 1

    await nextTick()

    stop()
    source.value = 2

    await nextTick()

    expect(callback).toHaveBeenCalledTimes(1)
  })
})
