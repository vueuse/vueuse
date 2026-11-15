import { describe, expect, it, vi } from 'vitest'
import { ref as deepRef, nextTick, shallowRef, watch } from 'vue'
import { ignorableWatch, watchIgnorable } from './index'

describe('watchIgnorable', () => {
  it('export module', () => {
    expect(watchIgnorable).toBeDefined()
    expect(ignorableWatch).toBeDefined()
  })

  it('ignore async updates', async () => {
    const source = shallowRef(0)
    const target = shallowRef(0)
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
    const source = shallowRef(0)
    const target = shallowRef(0)
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
    const source = shallowRef(0)
    const target = shallowRef(0)
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

  it('does not report the internal counting watch to the debug hooks', async () => {
    // `watchIgnorable` runs an extra sync watch to count updates to the source.
    // That watch is an implementation detail, so the debug hooks should observe
    // exactly what a plain `watch` on the same source would observe.
    const plainSource = shallowRef(0)
    const plainOnTrack = vi.fn()
    const plainOnTrigger = vi.fn()
    watch(plainSource, () => {}, { onTrack: plainOnTrack, onTrigger: plainOnTrigger })

    const source = shallowRef(0)
    const onTrack = vi.fn()
    const onTrigger = vi.fn()
    watchIgnorable(source, () => {}, { onTrack, onTrigger })

    plainSource.value = 1
    source.value = 1
    await nextTick()

    // guards against a "fix" that simply drops the hooks altogether
    expect(plainOnTrigger).toHaveBeenCalledTimes(1)
    expect(plainOnTrack).toHaveBeenCalled()

    expect(onTrigger).toHaveBeenCalledTimes(plainOnTrigger.mock.calls.length)
    expect(onTrack).toHaveBeenCalledTimes(plainOnTrack.mock.calls.length)
  })

  it('ignore deep updates', async () => {
    // the counting watch still needs `deep`, otherwise nested mutations are
    // never counted and `ignoreUpdates` stops ignoring anything
    const source = deepRef({ foo: 0 })
    const callback = vi.fn()
    const { ignoreUpdates } = watchIgnorable(source, callback, { deep: true })

    ignoreUpdates(() => {
      source.value.foo = 1
    })

    await nextTick()
    expect(callback).toHaveBeenCalledTimes(0)

    source.value.foo = 2

    await nextTick()
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('stop watch', async () => {
    const source = shallowRef(0)
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
