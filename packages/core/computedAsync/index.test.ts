import type { Ref } from 'vue'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { computed, nextTick, ref } from 'vue'
import { asyncComputed, computedAsync } from '.'

describe('computed', () => {
  it('is lazy', () => {
    const func = vi.fn(() => 'data')

    const data = computed(func)

    expect(func).not.toBeCalled()

    expect(data.value).toBe('data')

    expect(func).toBeCalledTimes(1)
  })
})

describe('computedAsync', () => {
  it('export module', () => {
    expect(computedAsync).toBeDefined()
    expect(asyncComputed).toBeDefined()
  })

  it('is not lazy by default', async () => {
    const func = vi.fn(() => Promise.resolve('data'))

    const data = computedAsync(func)

    expect(func).toBeCalledTimes(1)

    expect(data.value).toBeUndefined()
    await nextTick()
    expect(data.value).toBe('data')
  })

  it('types are correct', async () => {
    const func = vi.fn(() => Promise.resolve('data'))

    const data1 = computedAsync(func)
    const data2 = computedAsync(func, 'initialState')

    expectTypeOf(data1).toEqualTypeOf<Ref<string | undefined>>()
    expectTypeOf(data2).toEqualTypeOf<Ref<string>>()
  })

  it('call onError when error is thrown', async () => {
    const errorMessage = ref()
    const func = vi.fn(async () => {
      throw new Error('An Error Message')
    })

    const data = computedAsync(func, undefined, {
      onError(e) {
        if (e instanceof Error)
          errorMessage.value = e.message
      },
    })

    expect(func).toBeCalledTimes(1)

    expect(data.value).toBeUndefined()

    await nextTick()
    expect(data.value).toBeUndefined()
    expect(errorMessage.value).toBe('An Error Message')
  })

  it('is lazy if configured', async () => {
    const func = vi.fn(async () => 'data')

    const data = computedAsync(func, undefined, { lazy: true })

    expect(func).not.toBeCalled()

    // Act
    expect(data.value).toBeUndefined()

    await nextTick()
    // Assert
    expect(func).toBeCalledTimes(1)
    expect(data.value).toBe('data')
  })

  it('re-computes when dependency changes', async () => {
    const counter = ref(1)
    const double = computedAsync(() => {
      const result = counter.value * 2
      return Promise.resolve(result)
    })

    expect(double.value).toBeUndefined()

    await nextTick()

    expect(double.value).toBe(2)

    counter.value = 2
    expect(double.value).toBe(2)

    await nextTick()
    await nextTick()

    expect(double.value).toBe(4)
  })

  it('uses last result', async () => {
    const evaluating = ref(false)
    const resolutions: Array<() => void> = []

    const counter = ref(1)
    const double = computedAsync(() => {
      const result = counter.value * 2
      return new Promise(resolve => (resolutions.push(() => resolve(result))))
    }, undefined, evaluating)

    await nextTick()

    expect(double.value).toBeUndefined()
    expect(evaluating.value).toBe(true)
    expect(resolutions).toHaveLength(1)

    resolutions[0]()
    await nextTick()
    await nextTick()

    expect(double.value).toBe(2)
    expect(evaluating.value).toBe(false)

    counter.value = 2
    await nextTick()
    counter.value = 3
    await nextTick()
    counter.value = 4
    await nextTick()

    expect(evaluating.value).toBe(true)
    expect(resolutions).toHaveLength(4)

    resolutions[1]()
    await nextTick()
    await nextTick()

    expect(evaluating.value).toBe(true)
    expect(double.value).toBe(2)

    resolutions[3]()
    await nextTick()
    await nextTick()

    expect(evaluating.value).toBe(false)
    expect(double.value).toBe(8)

    resolutions[2]()
    await nextTick()
    await nextTick()

    expect(evaluating.value).toBe(false)
    expect(double.value).toBe(8)
  })

  it('evaluating works', async () => {
    vi.useFakeTimers()
    const evaluating = ref(false)

    const data = computedAsync(
      () => new Promise(resolve => setTimeout(() => resolve('data'), 0)),
      undefined,
      evaluating,
    )

    await nextTick()
    expect(data.value).toBeUndefined()
    expect(evaluating.value).toBe(true)

    await vi.advanceTimersByTimeAsync(0)

    expect(evaluating.value).toBe(false)
    expect(data.value).toBe('data')
  })

  it('triggers', async () => {
    const counter = ref(1)
    const double = computedAsync(() => {
      const result = counter.value * 2
      return Promise.resolve(result)
    })
    const other = computed(() => {
      return (double.value ?? 0) + 1
    })

    expect(double.value).toBeUndefined()

    await nextTick()
    await nextTick()

    expect(double.value).toBe(2)

    counter.value = 2
    expect(double.value).toBe(2)
    expect(other.value).toBe(3)

    await nextTick()
    await nextTick()

    expect(double.value).toBe(4)
    expect(other.value).toBe(5)
  })

  it('cancel is called', async () => {
    vi.useFakeTimers()
    const onCancel = vi.fn()
    const evaluating = ref(false)

    const data = ref('initial')
    const uppercase = computedAsync((cancel) => {
      cancel(onCancel)

      const uppercased = data.value.toUpperCase()

      return new Promise((resolve) => {
        setTimeout(resolve.bind(null, uppercased), 5)
      })
    }, '', evaluating)

    expect(uppercase.value).toBe('')

    await vi.advanceTimersByTimeAsync(10)
    expect(uppercase.value).toBe('INITIAL')

    data.value = 'to be cancelled'
    await nextTick()
    await nextTick()
    expect(onCancel).toBeCalledTimes(0)

    data.value = 'final'
    await nextTick()
    await nextTick()
    expect(onCancel).toBeCalledTimes(1)

    await vi.advanceTimersByTimeAsync(10)
    expect(uppercase.value).toBe('FINAL')
  })

  it('cancel is called for lazy', async () => {
    const onCancel = vi.fn()

    const data = ref('initial')
    const uppercase = computedAsync((cancel) => {
      cancel(() => onCancel())

      const uppercased = data.value.toUpperCase()

      return new Promise((resolve) => {
        setTimeout(resolve.bind(null, uppercased), 5)
      })
    }, '', { lazy: true })

    expect(uppercase.value).toBe('')

    await vi.advanceTimersByTimeAsync(10)
    expect(uppercase.value).toBe('INITIAL')

    data.value = 'to be cancelled'
    await nextTick()
    await nextTick()
    expect(onCancel).toBeCalledTimes(0)

    data.value = 'final'
    await nextTick()
    await nextTick()
    expect(onCancel).toBeCalledTimes(1)

    await vi.advanceTimersByTimeAsync(10)
    expect(uppercase.value).toBe('FINAL')
  })
})
