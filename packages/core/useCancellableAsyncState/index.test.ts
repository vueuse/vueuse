import { promiseTimeout } from '@vueuse/shared'
import { describe, expect, it, vi } from 'vitest'
import type { CancellableAsyncStateOnCancel } from '.'
import { useCancellableAsyncState } from '.'

describe('useCancellableAsyncState', () => {
  it('should be defined', () => {
    expect(useCancellableAsyncState).toBeDefined()
  })

  const p1 = (_: CancellableAsyncStateOnCancel, num = 1) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(num)
      }, 50)
    })
  }
  const p2 = async (_: CancellableAsyncStateOnCancel, id?: string) => {
    if (!id)
      throw new Error('error')
    return id
  }

  it('should work', async () => {
    const { execute, state } = useCancellableAsyncState(p1, 0)
    expect(state.value).toBe(0)
    await execute(0, 2)
    expect(state.value).toBe(2)
  })

  it('should work with await', async () => {
    const asyncState = useCancellableAsyncState(p1, 0, { immediate: true })
    expect(asyncState.isLoading.value).toBeTruthy()
    await asyncState
    expect(asyncState.isLoading.value).toBeFalsy()
  })

  it('should work with isLoading', () => {
    const { execute, isLoading } = useCancellableAsyncState(p1, 0, { immediate: false })
    expect(isLoading.value).toBeFalsy()
    execute(1)
    expect(isLoading.value).toBeTruthy()
  })

  it('should work with isReady', async () => {
    const { execute, isReady } = useCancellableAsyncState(p1, 0, { immediate: false })
    expect(isReady.value).toBeFalsy()
    await execute(1)
    expect(isReady.value).toBeTruthy()
  })

  it('should work with error', async () => {
    const { execute, error } = useCancellableAsyncState(p2, '0', { immediate: false })
    expect(error.value).toBeUndefined()
    await execute()
    expect(error.value).toBeInstanceOf(Error)
  })

  it('should work with delay', async () => {
    const { execute, state } = useCancellableAsyncState(p1, 0, { delay: 100 })
    await promiseTimeout(50)
    expect(state.value).toBe(0)
    await execute(0, 2)
    expect(state.value).toBe(2)
  })

  it('should work with onSuccess', async () => {
    const onSuccess = vi.fn()
    const { execute } = useCancellableAsyncState(p1, 0, { onSuccess })
    await execute(0, 2)
    expect(onSuccess).toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalledWith(2)
  })

  it('should work with onError', async () => {
    const onError = vi.fn()
    const { execute } = useCancellableAsyncState(p2, '0', { onError, immediate: false })
    await execute()
    expect(onError).toHaveBeenCalled()
    expect(onError).toHaveBeenCalledWith(new Error('error'))
  })

  it('should work with throwError', async () => {
    const { execute } = useCancellableAsyncState(p2, '0', { throwError: true, immediate: false })
    await expect(execute()).rejects.toThrowError('error')
  })

  it('cancel is called', async () => {
    const onCancel = vi.fn()
    const p = (cancel: CancellableAsyncStateOnCancel, num = 1) => {
      cancel(() => onCancel())
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(num)
        }, 10)
      })
    }

    const { execute, state } = useCancellableAsyncState(p, 0)
    await promiseTimeout(5)
    execute(0, 1)
    expect(state.value).toBe(0)
    expect(onCancel).toBeCalledTimes(1)

    await promiseTimeout(5)
    execute(0, 2)
    expect(state.value).toBe(0)
    expect(onCancel).toBeCalledTimes(2)

    await promiseTimeout(10)
    expect(state.value).toBe(2)
  })
})
