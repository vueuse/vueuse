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

    const data = asyncComputed(func)

    expect(func).toBeCalledTimes(1)

    expect(data.value).toBeUndefined()

    await nextTick()
    await nextTick()

    expect(data.value).toBe('data')
  })

  test('re-computes when dependency changes', async() => {
    const counter = ref(1)
    const double = asyncComputed(() => {
      const result = counter.value * 2
      return Promise.resolve(result)
    })

    expect(double.value).toBeUndefined()

    await nextTick()
    await nextTick()

    expect(double.value).toBe(2)

    counter.value = 2
    expect(double.value).toBe(2)

    await nextTick()
    await nextTick()

    expect(double.value).toBe(4)
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
})
