import { describe, expect, it, vi } from 'vitest'
import { retry } from '../../.test'
import { useAsyncQueue } from '.'

describe('useAsyncQueue', () => {
  const p1 = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1000)
      }, 10)
    })
  }

  const p2 = (result: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1000 + result)
      }, 20)
    })
  }

  const p3 = (result: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1000 + result)
      }, 30)
    })
  }

  const pError = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('e'))
      }, 30)
    })
  }

  it('should return the tasks result', async () => {
    const {
      activeIndex,
      result,
    } = useAsyncQueue([p1, p2, p3])
    await retry(() => {
      expect(activeIndex.value).toBe(2)
      expect(JSON.stringify(result)).toBe('[{"state":"fulfilled","data":1000},{"state":"fulfilled","data":2000},{"state":"fulfilled","data":3000}]')
    })
  })

  it('should passed the current task result to the next task', async () => {
    const {
      activeIndex,
      result,
    } = useAsyncQueue([p1, p2])
    await retry(() => {
      expect(activeIndex.value).toBe(1)
      expect(result[activeIndex.value].data).toBe(2000)
    })
  })

  it('should trigger onFinished when the tasks ends', async () => {
    const onFinishedSpy = vi.fn()
    const { activeIndex } = useAsyncQueue([p1, p2], {
      onFinished: onFinishedSpy,
    })
    await retry(() => {
      expect(activeIndex.value).toBe(1)
      expect(onFinishedSpy).toHaveBeenCalled()
    })
  })

  it ('should trigger onError when the tasks fails', async () => {
    const onErrorSpy = vi.fn()
    const { activeIndex } = useAsyncQueue([p3, pError], {
      onError: onErrorSpy,
    })
    await retry(() => {
      expect(activeIndex.value).toBe(1)
      expect(onErrorSpy).toHaveBeenCalledOnce()
    })
  })

  it ('should interrupt the tasks when current task fails', async () => {
    const finalTaskSpy = vi.fn(() => Promise.resolve('data'))
    const onFinishedSpy = vi.fn()
    useAsyncQueue([p1, pError, finalTaskSpy], {
      onFinished: onFinishedSpy,
    })

    await retry(() => {
      expect(onFinishedSpy).toHaveBeenCalled()
      expect(finalTaskSpy).not.toHaveBeenCalled()
    })
  })

  it ('should not interrupt the tasks when current task fails', async () => {
    const finalTaskSpy = vi.fn(() => Promise.resolve('data'))
    const onFinishedSpy = vi.fn()
    useAsyncQueue([p1, pError, finalTaskSpy], {
      interrupt: false,
      onFinished: onFinishedSpy,
    })
    await retry(() => {
      expect(onFinishedSpy).toHaveBeenCalled()
      expect(finalTaskSpy).toHaveBeenCalledOnce()
    })
  })

  it('should cancel the tasks', async () => {
    const controller = new AbortController()
    const { activeIndex, result } = useAsyncQueue([p1], {
      signal: controller.signal,
    })
    controller.abort()
    await retry(() => {
      expect(activeIndex.value).toBe(0)
      expect(result).toHaveLength(1)
      expect(result[activeIndex.value]).toMatchInlineSnapshot(`
        {
          "data": [Error: aborted],
          "state": "aborted",
        }
      `)
    })
  })

  it('should abort the tasks when AbortSignal.abort is triggered', async () => {
    const controller = new AbortController()
    const abort = () => controller.abort()
    const finalTaskSpy = vi.fn(() => Promise.resolve('data'))
    const { activeIndex, result } = useAsyncQueue([p1, abort, finalTaskSpy], {
      signal: controller.signal,
    })
    await retry(() => {
      expect(activeIndex.value).toBe(2)
      expect(result).toHaveLength(3)
      expect(finalTaskSpy).not.toHaveBeenCalled()
    })
  })
})
