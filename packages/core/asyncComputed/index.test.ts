import { computed, nextTick, ref } from 'vue-demi'
import { promiseTimeout } from '@vueuse/shared'
import { asyncComputed } from '.'

describe('computed', () => {
  it('is lazy', () => {
    const func = vitest.fn(() => 'data')

    const data = computed(func)

    expect(func).not.toBeCalled()

    expect(data.value).toBe('data')

    expect(func).toBeCalledTimes(1)
  })
})

describe('asyncComputed', () => {
  it('is not lazy by default', async() => {
    const func = vitest.fn(() => Promise.resolve('data'))

    const data = asyncComputed(func)

    expect(func).toBeCalledTimes(1)

    expect(data.value).toBeUndefined()

    await promiseTimeout(10)

    expect(data.value).toBe('data')
  })

  it('call onError when error is thrown', async() => {
    let errorMessage
    const func = vitest.fn(async() => {
      throw new Error('An Error Message')
    })

    const data = asyncComputed(func, undefined, {
      onError(e) {
        if (e instanceof Error)
          errorMessage = e.message
      },
    })

    expect(func).toBeCalledTimes(1)

    expect(data.value).toBeUndefined()

    await promiseTimeout(10)

    expect(data.value).toBeUndefined()
    expect(errorMessage).toBe('An Error Message')
  })

  it('is lazy if configured', async() => {
    const func = vitest.fn(async() => 'data')

    const data = asyncComputed(func, undefined, { lazy: true })

    expect(func).not.toBeCalled()

    // Act
    expect(data.value).toBeUndefined()

    await promiseTimeout(10)

    // Assert
    expect(func).toBeCalledTimes(1)
    expect(data.value).toBe('data')
  })

  it('re-computes when dependency changes', async() => {
    const counter = ref(1)
    const double = asyncComputed(() => {
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

  test('evaluating works', async() => {
    const evaluating = ref(false)

    const data = asyncComputed(() =>
      new Promise(resolve => setTimeout(() => resolve('data'), 0)),
    undefined,
    evaluating)

    await nextTick()
    expect(data.value).toBeUndefined()
    expect(evaluating.value).toBe(true)

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(evaluating.value).toBe(false)
    expect(data.value).toBe('data')
  })

  test('triggers', async() => {
    const counter = ref(1)
    const double = asyncComputed(() => {
      const result = counter.value * 2
      return Promise.resolve(result)
    })
    const other = computed(() => {
      return double.value + 1
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

  test('cancel is called', async() => {
    const onCancel = vitest.fn()

    const data = ref('initial')
    const uppercase = asyncComputed((cancel) => {
      cancel(() => onCancel())

      const uppercased = data.value.toUpperCase()

      return new Promise((resolve) => {
        setTimeout(resolve.bind(null, uppercased), 0)
      })
    })

    expect(uppercase.value).toBeUndefined()

    await promiseTimeout(10)

    expect(uppercase.value).toBe('INITIAL')

    data.value = 'to be cancelled'
    await nextTick()
    await nextTick()
    expect(onCancel).toBeCalledTimes(0)

    data.value = 'final'
    await nextTick()
    await nextTick()
    expect(onCancel).toBeCalledTimes(1)

    await promiseTimeout(10)

    expect(uppercase.value).toBe('FINAL')
  })

  test('cancel is called for lazy', async() => {
    const onCancel = vitest.fn()

    const data = ref('initial')
    const uppercase = asyncComputed((cancel) => {
      cancel(() => onCancel())

      const uppercased = data.value.toUpperCase()

      return new Promise((resolve) => {
        setTimeout(resolve.bind(null, uppercased), 0)
      })
    }, '', { lazy: true })

    expect(uppercase.value).toBe('')

    await promiseTimeout(10)

    expect(uppercase.value).toBe('INITIAL')

    data.value = 'to be cancelled'
    await nextTick()
    await nextTick()
    expect(onCancel).toBeCalledTimes(0)

    data.value = 'final'
    await nextTick()
    await nextTick()
    expect(onCancel).toBeCalledTimes(1)

    await promiseTimeout(10)

    expect(uppercase.value).toBe('FINAL')
  })
})
