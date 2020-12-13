import { computed } from 'vue-demi'
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
})
