import { computed, ref } from 'vue-demi'
import { renderHook } from '../../_tests'
import { asyncComputed } from '.'

describe('computed', () => {
  it('is lazy', async() => {
    const func = jest.fn(() => 'data')

    const instance = renderHook(() => {
      const data = computed(func)

      return {
        data,
      }
    }).vm

    expect(func).not.toBeCalled()

    // Act
    expect(instance.data).toBe('data')

    // Assert
    expect(func).toBeCalledTimes(1)
  })
})

describe('asyncComputed', () => {
  it('is lazy', async() => {
    const func = jest.fn(() => Promise.resolve('data'))

    const instance = renderHook(() => {
      const data = asyncComputed(func)

      return {
        data,
      }
    }).vm

    expect(func).not.toBeCalled()

    // Act
    expect(instance.data).toBeUndefined()
    await instance.$nextTick()

    // Assert
    expect(func).toBeCalledTimes(1)
    expect(instance.data).toBe('data')
  })

  it('can cancel', async() => {
    const cancel = jest.fn()

    let func = jest.fn((onInvalidate, param) => {
      onInvalidate(() => {
        cancel()
      })

      return new Promise((resolve) => setTimeout(() => resolve(param), 100))
    })

    const instance = renderHook(() => {
      const param = ref('data')
      const evaluating = ref(false)
      const data = asyncComputed((onInvalidate) => func(onInvalidate, param.value), undefined, evaluating)

      return {
        data,
        evaluating,
        param
      }
    }).vm

    // Act
    expect(instance.data).toBeUndefined()
    await instance.$nextTick()

    expect(func).toBeCalledTimes(1)
    expect(cancel).not.toBeCalled()

    instance.param = 'new data'
    await instance.$nextTick()

    expect(func).toBeCalledTimes(2)
    expect(cancel).toBeCalledTimes(1)
  })
})
