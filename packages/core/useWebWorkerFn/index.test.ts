import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useWebWorkerFn } from './index'

class MockWorker {
  static instances: MockWorker[] = []

  onmessage: ((e: MessageEvent) => void) | null = null
  onerror: ((e: ErrorEvent) => void) | null = null
  terminated = false
  messages: any[] = []

  constructor(public url: string) {
    MockWorker.instances.push(this)
  }

  postMessage(data: any) {
    this.messages.push(data)
  }

  terminate() {
    this.terminated = true
  }
}

function settlement(promise: Promise<any>) {
  promise.catch(() => {})
  return Promise.race([
    promise.then(() => 'resolved', () => 'rejected'),
    new Promise(resolve => queueMicrotask(() => queueMicrotask(() => resolve('pending')))),
  ])
}

describe('useWebWorkerFn', () => {
  beforeEach(() => {
    MockWorker.instances = []
    vi.stubGlobal('Worker', MockWorker)
    vi.stubGlobal('URL', Object.assign(Object.create(URL), {
      createObjectURL: () => 'blob:mock',
      revokeObjectURL: () => {},
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('should resolve and terminate the worker on success', async () => {
    const { workerFn, workerStatus } = useWebWorkerFn((value: number) => value)

    const promise = workerFn(1)
    expect(workerStatus.value).toBe('RUNNING')

    MockWorker.instances[0].onmessage!({ data: ['SUCCESS', 42] } as MessageEvent)

    await expect(promise).resolves.toBe(42)
    expect(workerStatus.value).toBe('SUCCESS')
    expect(MockWorker.instances[0].terminated).toBe(true)
  })

  it('should reject when the worker reports an error', async () => {
    const { workerFn, workerStatus } = useWebWorkerFn((value: number) => value)

    const promise = workerFn(1)
    MockWorker.instances[0].onmessage!({ data: ['ERROR', new Error('boom')] } as MessageEvent)

    await expect(promise).rejects.toThrow('boom')
    expect(workerStatus.value).toBe('ERROR')
  })

  it('should reject the pending promise when the timeout expires', async () => {
    vi.useFakeTimers()
    const { workerFn, workerStatus } = useWebWorkerFn((value: number) => value, { timeout: 100 })

    const promise = workerFn(1)
    vi.advanceTimersByTime(200)

    expect(workerStatus.value).toBe('TIMEOUT_EXPIRED')
    expect(MockWorker.instances[0].terminated).toBe(true)
    vi.useRealTimers()
    await expect(settlement(promise)).resolves.toBe('rejected')
  })

  it('should reject the pending promise on manual termination', async () => {
    const { workerFn, workerTerminate, workerStatus } = useWebWorkerFn((value: number) => value)

    const promise = workerFn(1)
    workerTerminate()

    expect(workerStatus.value).toBe('PENDING')
    await expect(settlement(promise)).resolves.toBe('rejected')
  })

  it('should reject the pending promise when the scope is disposed', async () => {
    const scope = effectScope()
    const promise = scope.run(() => {
      const { workerFn } = useWebWorkerFn((value: number) => value)
      return workerFn(1)
    })!

    scope.stop()

    expect(MockWorker.instances[0].terminated).toBe(true)
    await expect(settlement(promise)).resolves.toBe('rejected')
  })

  it('should not reject an already resolved promise on termination', async () => {
    const { workerFn, workerTerminate } = useWebWorkerFn((value: number) => value)

    const promise = workerFn(1)
    MockWorker.instances[0].onmessage!({ data: ['SUCCESS', 42] } as MessageEvent)
    workerTerminate()

    await expect(promise).resolves.toBe(42)
  })
})
