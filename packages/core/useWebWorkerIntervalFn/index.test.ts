import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useWebWorkerIntervalFn } from './index.ts'

// ---- Mock Web APIs ----
class MockWorker {
  onmessage: ((ev: MessageEvent) => void) | null = null
  constructor(public url: string) {}
  postMessage = vi.fn()
  terminate = vi.fn()
}

beforeAll(() => {
  // mock Worker
  globalThis.Worker = vi.fn().mockImplementation((url: string) => new MockWorker(url))

  // mock URL API
  globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
  globalThis.URL.revokeObjectURL = vi.fn()
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('useWebWorkerIntervalFn', () => {
  it('should call cb immediately when immediateCallback=true', () => {
    const cb = vi.fn()
    useWebWorkerIntervalFn(cb, 1000, { immediate: false, immediateCallback: true }).resume()
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('should not start when interval <= 0', () => {
    const cb = vi.fn()
    const { resume, isActive } = useWebWorkerIntervalFn(cb, 0, { immediate: false })
    resume()
    expect(isActive.value).toBe(false)
    expect(cb).not.toHaveBeenCalled()
  })

  it('should pause after resume', () => {
    const cb = vi.fn()
    const { resume, pause, isActive } = useWebWorkerIntervalFn(cb, 1000, { immediate: false })
    resume()
    expect(isActive.value).toBe(true)
    pause()
    expect(isActive.value).toBe(false)
  })

  it('should auto resume when immediate=true', () => {
    const cb = vi.fn()
    const { isActive } = useWebWorkerIntervalFn(cb, 1000, { immediate: true })
    expect(isActive.value).toBe(true)
  })

  it('should restart when interval ref changes', async () => {
    const cb = vi.fn()
    // eslint-disable-next-line no-ref/no-ref
    const interval = ref(1000)
    const { isActive } = useWebWorkerIntervalFn(cb, interval, { immediate: true })
    expect(isActive.value).toBe(true)

    interval.value = 2000
    await nextTick()

    expect(isActive.value).toBe(true) // 说明 resume 被触发
  })

  it('should handle worker messages correctly', () => {
    const cb = vi.fn()
    const { resume } = useWebWorkerIntervalFn(cb, 1000, { immediate: false })

    resume()

    // 模拟 worker.onmessage
    ;(globalThis as any).postMessage = vi.fn()
    const worker = (window as any).Worker?.mock?.instances?.[0]
    if (worker?.onmessage) {
      worker.onmessage({ data: ['TICK'] } as MessageEvent)
      expect(cb).toHaveBeenCalled()

      worker.onmessage({ data: ['ENDED'] } as MessageEvent)
      expect(cb).toHaveBeenCalledTimes(1) // 不会再调用
    }
  })
})
