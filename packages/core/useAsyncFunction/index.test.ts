import { expect } from 'vitest'
import { useAsyncFunction } from '.'

const mock = {
  fn: () => new Promise(resolve => setTimeout(() => resolve('result'), 1500)),
}

describe('useAsyncFunction', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('works correctly', async () => {
    const spy = vi.spyOn(mock, 'fn')

    const { trigger, isLoading, result, loadingCalls, calls } = useAsyncFunction(mock.fn)

    expect(isLoading.value).toBe(false)

    const promise = trigger()

    expect(isLoading.value).toBe(true)
    expect(result.value).toBe(undefined)
    expect(loadingCalls.value).toBe(1)
    expect(calls.value).toBe(0)

    await promise

    expect(spy).toBeCalled()
    expect(result.value).toBe('result')
    expect(isLoading.value).toBe(false)
    expect(loadingCalls.value).toBe(0)
    expect(calls.value).toBe(1)
  })

  it('words correctly with several results', async () => {
    const spy = vi.spyOn(mock, 'fn')

    const { trigger, isLoading, result, loadingCalls, calls } = useAsyncFunction(mock.fn, { several: true })

    const promises = [trigger(), trigger(), trigger()]

    expect(spy).toBeCalledTimes(3)
    expect(isLoading.value).toBe(true)
    expect(result.value).toEqual([])
    expect(loadingCalls.value).toBe(3)
    expect(calls.value).toBe(0)

    await Promise.all(promises)

    expect(isLoading.value).toBe(false)
    expect(result.value).toEqual(['result', 'result', 'result'])
    expect(loadingCalls.value).toBe(0)
    expect(calls.value).toBe(3)
  })
})
