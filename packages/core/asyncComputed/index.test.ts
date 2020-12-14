import { ref, computed, nextTick } from 'vue-demi'
import { renderHook } from '../../_tests'
import { asyncComputed } from '.'

describe('computed', () => {
  it('is lazy', async() => {
    const func = jest.fn(() => 'data')

    renderHook(() => {
      const data = computed(func)

      expect(func).not.toBeCalled()

      expect(data.value).toBe('data')

      expect(func).toBeCalledTimes(1)
    })
  })
})

describe('asyncComputed', () => {
  it('is not lazy by default', async() => {
    const func = jest.fn(() => Promise.resolve('data'))

    const instance = renderHook(() => {
      const data = asyncComputed(func)
      return { data }
    }).vm

    expect(func).toBeCalledTimes(1)

    expect(instance.data).toBeUndefined()

    await nextTick()
    await nextTick()

    expect(instance.data).toBe('data')
  })

  it('is lazy if configured', async() => {
    const func = jest.fn(() => Promise.resolve('data'))

    const instance = renderHook(() => {
      const data = asyncComputed(func, undefined, { lazy: true })

      return {
        data,
      }
    }).vm

    expect(func).not.toBeCalled()

    // Act
    expect(instance.data).toBeUndefined()
    await nextTick()

    // Assert
    expect(func).toBeCalledTimes(1)
    expect(instance.data).toBe('data')
  })

  it('re-computes when dependency changes', async() => {
    const instance = renderHook(() => {
      const counter = ref(1)
      const double = asyncComputed(() => {
        const result = counter.value * 2
        return Promise.resolve(result)
      })
      return { counter, double }
    }).vm

    expect(instance.double).toBeUndefined()

    await nextTick()

    expect(instance.double).toBe(2)

    instance.counter = 2
    expect(instance.double).toBe(2)

    await nextTick()
    await nextTick()

    expect(instance.double).toBe(4)
  })

  test('evaluating works', async() => {
    const instance = renderHook(() => {
      const evaluating = ref(false)

      const data = asyncComputed(() =>
        new Promise(resolve => setTimeout(() => resolve('data'), 0)),
      undefined,
      evaluating)
      return { data, evaluating }
    }).vm

    await nextTick()
    expect(instance.data).toBeUndefined()
    expect(instance.evaluating).toBe(true)

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(instance.evaluating).toBe(false)
    expect(instance.data).toBe('data')
  })

  test('triggers', async() => {
    const instance = renderHook(() => {
      const counter = ref(1)
      const double = asyncComputed(() => {
        const result = counter.value * 2
        return Promise.resolve(result)
      })
      const other = computed(() => {
        return double.value + 1
      })
      return { counter, double, other }
    }).vm

    expect(instance.double).toBeUndefined()

    await nextTick()
    await nextTick()

    expect(instance.double).toBe(2)

    instance.counter = 2
    expect(instance.double).toBe(2)
    expect(instance.other).toBe(3)

    await nextTick()
    await nextTick()

    expect(instance.double).toBe(4)
    expect(instance.other).toBe(5)
  })

  test('cancel is called', async() => {
    const onCancel = jest.fn()

    const instance = renderHook(() => {
      const data = ref('initial')
      const uppercase = asyncComputed((cancel) => {
        cancel(() => onCancel())

        const uppercased = data.value.toUpperCase()

        return new Promise((resolve) => {
          setTimeout(resolve.bind(null, uppercased), 0)
        })
      })
      return { data, uppercase }
    }).vm

    expect(instance.uppercase).toBeUndefined()

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(instance.uppercase).toBe('INITIAL')

    instance.data = 'to be cancelled'
    await nextTick()
    await nextTick()
    expect(onCancel).toBeCalledTimes(0)

    instance.data = 'final'
    await nextTick()
    await nextTick()
    expect(onCancel).toBeCalledTimes(1)

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(instance.uppercase).toBe('FINAL')
  })

  test('cancel is called for lazy', async() => {
    const onCancel = jest.fn()

    const instance = renderHook(() => {
      const data = ref('initial')
      const uppercase = asyncComputed((cancel) => {
        cancel(() => onCancel())

        const uppercased = data.value.toUpperCase()

        return new Promise((resolve) => {
          setTimeout(resolve.bind(null, uppercased), 0)
        })
      }, '', { lazy: true })
      return { data, uppercase }
    }).vm

    expect(instance.uppercase).toBe('')

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(instance.uppercase).toBe('INITIAL')

    instance.data = 'to be cancelled'
    await nextTick()
    await nextTick()
    expect(onCancel).toBeCalledTimes(0)

    instance.data = 'final'
    await nextTick()
    await nextTick()
    expect(onCancel).toBeCalledTimes(1)

    await new Promise(resolve => setTimeout(resolve, 0))

    expect(instance.uppercase).toBe('FINAL')
  })
})
