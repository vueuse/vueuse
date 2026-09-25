import type { Ref } from 'vue'
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import { ref } from 'vue'
import { computedDebounced } from './index'

describe('computedDebounced', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(computedDebounced).toBeDefined()
  })

  it('computes the initial value eagerly', () => {
    const source = ref('hello')
    const value = computedDebounced(() => source.value.toUpperCase(), 100)

    expect(value.value).toBe('HELLO')
  })

  it('updates after the debounce delay', async () => {
    const source = ref(1)
    const value = computedDebounced(() => source.value * 2, 100)

    source.value = 2
    expect(value.value).toBe(2) // still the old value

    await vi.advanceTimersByTimeAsync(99)
    expect(value.value).toBe(2)

    await vi.advanceTimersByTimeAsync(1)
    expect(value.value).toBe(4)
  })

  it('merges rapid changes into a single update', async () => {
    const source = ref(1)
    const getter = vi.fn(() => source.value * 2)
    const value = computedDebounced(getter, 100)

    expect(getter).toHaveBeenCalledTimes(1) // eager initial computation

    source.value = 2
    source.value = 3
    source.value = 4

    await vi.advanceTimersByTimeAsync(100)

    expect(value.value).toBe(8)
    expect(getter).toHaveBeenCalledTimes(2) // initial + one debounced update
  })

  it('reacts to multiple reactive dependencies', async () => {
    const a = ref(1)
    const b = ref(10)
    const value = computedDebounced(() => a.value + b.value, 100)

    a.value = 2
    await vi.advanceTimersByTimeAsync(100)
    expect(value.value).toBe(12)

    b.value = 20
    await vi.advanceTimersByTimeAsync(100)
    expect(value.value).toBe(22)
  })

  it('does not trigger when the computed value is unchanged', async () => {
    const source = ref('a')
    let getterCalls = 0
    const value = computedDebounced(() => {
      getterCalls++
      return source.value.trim()
    }, 100)

    expect(getterCalls).toBe(1)

    // changing the dependency to a value that trims to the same string
    source.value = ' a '
    await vi.advanceTimersByTimeAsync(100)

    expect(value.value).toBe('a')
    // the computed cache means the getter re-runs, but the ref is not updated
    expect(getterCalls).toBe(2)
  })

  it('supports maxWait', async () => {
    const source = ref(1)
    const value = computedDebounced(() => source.value * 2, 1000, { maxWait: 150 })

    source.value = 2
    // keep the source changing so the debounce never settles
    for (let i = 0; i < 10; i++) {
      await vi.advanceTimersByTimeAsync(80)
      source.value++
    }

    // maxWait forced the debounced update through at least once by now
    expect(value.value).toBeGreaterThan(2)
  })

  it('supports a reactive delay', async () => {
    const source = ref(1)
    const delay = ref(100)
    const value = computedDebounced(() => source.value * 2, delay)

    source.value = 2
    await vi.advanceTimersByTimeAsync(100)
    expect(value.value).toBe(4)

    delay.value = 500
    source.value = 3
    await vi.advanceTimersByTimeAsync(100)
    expect(value.value).toBe(4) // not yet
    await vi.advanceTimersByTimeAsync(400)
    expect(value.value).toBe(6)
  })

  it('returns a readonly ref', () => {
    const source = ref(1)
    const value = computedDebounced(() => source.value, 100)

    // @ts-expect-error - readonly
    value.value = 999

    expectTypeOf(value).toExtend<Readonly<Ref<number>>>()
  })
})
