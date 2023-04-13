import { promiseTimeout } from '@vueuse/shared'
import { useAsyncState } from '../useAsyncState'

describe('useAsyncState', () => {
  it('should be defined', () => {
    expect(useAsyncState).toBeDefined()
  })

  const p1 = (num = 1) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(num)
      }, 50)
    })
  }
  const p2 = async (id?: string) => {
    if (!id)
      throw new Error('error')
    return id
  }

  it('should work', async () => {
    const { execute, state } = useAsyncState(p1, 0)
    expect(state.value).toBe(0)
    await execute(0, 2)
    expect(state.value).toBe(2)
  })

  it('should work with isLoading', () => {
    const { execute, isLoading } = useAsyncState(p1, 0, { immediate: false })
    expect(isLoading.value).toBeFalsy()
    execute(1)
    expect(isLoading.value).toBeTruthy()
  })

  it('should work with isReady', async () => {
    const { execute, isReady } = useAsyncState(p1, 0, { immediate: false })
    expect(isReady.value).toBeFalsy()
    await execute(1)
    expect(isReady.value).toBeTruthy()
  })

  it('should work with error', async () => {
    const { execute, error } = useAsyncState(p2, '0', { immediate: false })
    expect(error.value).toBeUndefined()
    await execute()
    expect(error.value).toBeInstanceOf(Error)
  })

  it('should work with delay', async () => {
    const { execute, state } = useAsyncState(p1, 0, { delay: 100 })
    await promiseTimeout(50)
    expect(state.value).toBe(0)
    await execute(0, 2)
    expect(state.value).toBe(2)
  })

  it('should work with onSuccess', async () => {
    const onSuccess = vi.fn()
    const { execute } = useAsyncState(p1, 0, { onSuccess })
    await execute(0, 2)
    expect(onSuccess).toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalledWith(2)
  })

  it('should work with onError', async () => {
    const onError = vi.fn()
    const { execute } = useAsyncState(p2, '0', { onError, immediate: false })
    await execute()
    expect(onError).toHaveBeenCalled()
    expect(onError).toHaveBeenCalledWith(new Error('error'))
  })

  it('should work with throwError', async () => {
    const { execute } = useAsyncState(p2, '0', { throwError: true, immediate: false })
    await expect(execute()).rejects.toThrowError('error')
  })
})
