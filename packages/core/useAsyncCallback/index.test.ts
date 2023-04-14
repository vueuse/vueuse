import { useAsyncCallback } from '.'

describe('useAsyncCallback', () => {
  const value = 'test'
  const errMsg = 'test error'

  it('execute function should work', async () => {
    const fn = vi.fn(() => Promise.resolve(value))
    const [execute, loading, error] = useAsyncCallback(fn)

    const result = await execute()
    expect(result).toBe(value)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(loading.value).toBe(false)
    expect(error.value).toBeUndefined()
  })

  it('execute function should handle error', async () => {
    const fn = vi.fn()
    const [execute, loading, error] = useAsyncCallback(fn)

    fn.mockRejectedValueOnce(new Error(errMsg))
    await expect(execute()).rejects.toThrow(new Error(errMsg))

    expect(fn).toHaveBeenCalledTimes(1)
    expect(loading.value).toBe(false)
    expect(error.value).toBeInstanceOf(Error)
    expect(error.value.message).toBe(errMsg)
  })

  it('loading and error should be reactive', async () => {
    const fn = vi.fn()
    const [execute, loading, error] = useAsyncCallback(fn)

    expect(loading.value).toBe(false)
    expect(error.value).toBeUndefined()

    const promise = execute()

    expect(loading.value).toBe(true)
    expect(error.value).toBeUndefined()

    await promise

    expect(loading.value).toBe(false)
    expect(error.value).toBeUndefined()

    fn.mockRejectedValueOnce(new Error(errMsg))
    await expect(execute()).rejects.toThrow(new Error(errMsg))

    expect(fn).toHaveBeenCalledTimes(2)
    expect(loading.value).toBe(false)
    expect(error.value).toBeInstanceOf(Error)
  })
})
