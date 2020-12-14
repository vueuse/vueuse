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
  test('it is not lazy', async() => {
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

  test('re-computes when dependency changes', async() => {
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
    await nextTick()

    expect(instance.double).toBe(2)

    instance.counter = 2
    expect(instance.double).toBe(2)

    await nextTick()
    await nextTick()

    expect(instance.double).toBe(4)
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
})
