import { describe, expect, it, vi } from 'vitest'
import { useAsyncQueue } from './index'

describe('useAsyncQueue synchronous results', () => {
  it('passes synchronous results to the next task', async () => {
    const onFinished = vi.fn()
    const onError = vi.fn()
    const { result } = useAsyncQueue([
      () => 10,
      (previous: number) => previous + 5,
    ], { onFinished, onError })

    await vi.waitFor(() => expect(onFinished).toHaveBeenCalledOnce())

    expect(result).toEqual([
      { state: 'fulfilled', data: 10 },
      { state: 'fulfilled', data: 15 },
    ])
    expect(onError).not.toHaveBeenCalled()
  })

  it('supports mixed asynchronous and void tasks', async () => {
    const onFinished = vi.fn()
    const finalTask = vi.fn((previous: undefined) => {
      expect(previous).toBeUndefined()
      return Promise.resolve('done')
    })
    const { result } = useAsyncQueue([
      () => Promise.resolve(10),
      (previous: number) => { expect(previous).toBe(10) },
      finalTask,
    ], { onFinished })

    await vi.waitFor(() => expect(onFinished).toHaveBeenCalledOnce())

    expect(result).toEqual([
      { state: 'fulfilled', data: 10 },
      { state: 'fulfilled', data: undefined },
      { state: 'fulfilled', data: 'done' },
    ])
    expect(finalTask).toHaveBeenCalledOnce()
  })

  it('does not overwrite aborted results when an in-flight task finishes', async () => {
    const controller = new AbortController()
    let finish!: (value: number) => void
    const task = vi.fn(() => new Promise<number>((resolve) => {
      finish = resolve
    }))
    const nextTask = vi.fn(() => 20)
    const { result, activeIndex } = useAsyncQueue([task, nextTask], { signal: controller.signal })

    await vi.waitFor(() => expect(task).toHaveBeenCalledOnce())
    controller.abort()
    await vi.waitFor(() => expect(activeIndex.value).toBe(1))
    finish(10)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(activeIndex.value).toBe(1)
    expect(result.map(item => item.state)).toEqual(['aborted', 'aborted'])
    expect(nextTask).not.toHaveBeenCalled()
  })
})
