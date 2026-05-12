import { promiseTimeout } from '@vueuse/shared'
import { describe, expect, it, vi } from 'vitest'
import { nextTick, shallowRef } from 'vue'
import { useAsyncState } from './index'

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

  it('should executeImmediate', async () => {
    const { executeImmediate, state } = useAsyncState(p1, 0)
    expect(state.value).toBe(0)
    await executeImmediate(2)
    expect(state.value).toBe(2)
  })

  it('should work with await', async () => {
    const asyncState = useAsyncState(p1, 0, { immediate: true })
    expect(asyncState.isLoading.value).toBeTruthy()
    await asyncState
    expect(asyncState.isLoading.value).toBeFalsy()
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

  it('default onError uses globalThis.reportError', async () => {
    const originalReportError = globalThis.reportError
    const mockReportError = vi.fn()
    globalThis.reportError = mockReportError

    const error = new Error('error message')
    const func = vi.fn(async () => {
      throw error
    })

    const { execute } = useAsyncState(func, '', { immediate: false })
    await execute()
    expect(func).toBeCalledTimes(1)

    await nextTick()
    expect(mockReportError).toHaveBeenCalledWith(error)
    globalThis.reportError = originalReportError
  })

  it('supports initialState as shallow ref', async () => {
    const initialState = shallowRef(200)
    const asyncValue = Promise.resolve(100)
    const { state } = useAsyncState(asyncValue, initialState)
    await asyncValue
    expect(state.value).toBe(100)
    expect(initialState).toBe(state)
  })

  it('does not set `state` from an outdated execution', async () => {
    const { execute, state } = useAsyncState((returnValue: string, timeout: number) => promiseTimeout(timeout).then(() => returnValue), '')
    await Promise.all([
      execute(0, 'foo', 100),
      execute(0, 'bar', 50),
    ])
    expect(state.value).toBe('bar')
  })

  it('does not set `isReady` from an outdated execution', async () => {
    const { execute, isReady } = useAsyncState(promiseTimeout, shallowRef<void>())
    void execute(0, 0)
    void execute(0, 100)
    await promiseTimeout(50)
    expect(isReady.value).toBe(false)
  })

  it('does not set `isLoading` from an outdated execution', async () => {
    const { execute, isLoading } = useAsyncState(promiseTimeout, shallowRef<void>())
    void execute(0, 0)
    void execute(0, 100)
    await promiseTimeout(50)
    expect(isLoading.value).toBe(true)
  })

  it('does not set `error` from an outdated execution', async () => {
    const { execute, error } = useAsyncState(promiseTimeout, shallowRef<void>())
    await Promise.all([
      execute(0, 100, true),
      execute(0, 0),
    ])
    expect(error.value).toBeUndefined()
  })
})
