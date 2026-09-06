import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useSetup } from '../../.test'
import { useDisplayMedia } from './index'

function createMockStream(id: number, live: Set<number>) {
  const tracks = [{
    stop: vi.fn(() => {
      live.delete(id)
    }),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }]
  live.add(id)
  return {
    id,
    getTracks: () => tracks,
    tracks,
  } as unknown as MediaStream
}

function createMockMediaDevices(delay = 0) {
  let n = 0
  const live = new Set<number>()
  const getDisplayMedia = vi.fn(() => new Promise<MediaStream>((resolve) => {
    setTimeout(() => {
      resolve(createMockStream(++n, live))
    }, delay)
  }))

  return {
    getDisplayMedia,
    live,
  }
}

describe('useDisplayMedia', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should not leak streams from concurrent starts', async () => {
    const mediaDevices = createMockMediaDevices(20)
    const navigator = { mediaDevices } as unknown as Navigator

    const vm = useSetup(() => {
      const api = useDisplayMedia({ navigator })
      return { api }
    })

    const p1 = vm.api.start()
    const p2 = vm.api.start()
    await vi.advanceTimersByTimeAsync(20)
    await Promise.all([p1, p2])

    expect(mediaDevices.getDisplayMedia).toHaveBeenCalledTimes(1)
    expect(mediaDevices.live.size).toBe(1)

    vm.unmount()
  })

  it('should discard in-flight stream when stopped before getDisplayMedia resolves', async () => {
    const mediaDevices = createMockMediaDevices(20)
    const navigator = { mediaDevices } as unknown as Navigator

    const vm = useSetup(() => {
      const api = useDisplayMedia({ navigator, enabled: true })
      return { api }
    })

    await nextTick()
    expect(mediaDevices.getDisplayMedia).toHaveBeenCalledTimes(1)

    vm.api.stop()
    await vi.advanceTimersByTimeAsync(20)

    expect(vm.api.stream.value).toBeUndefined()
    expect(mediaDevices.live.size).toBe(0)

    vm.unmount()
  })

  it('should stop orphaned stream tracks when superseded by a later start', async () => {
    const mediaDevices = createMockMediaDevices(20)
    const navigator = { mediaDevices } as unknown as Navigator

    const vm = useSetup(() => {
      const api = useDisplayMedia({ navigator })
      return { api }
    })

    const p1 = vm.api.start()
    await vi.advanceTimersByTimeAsync(10)
    vm.api.stop()
    const p2 = vm.api.start()
    await vi.advanceTimersByTimeAsync(20)
    await Promise.all([p1, p2])

    expect(mediaDevices.getDisplayMedia).toHaveBeenCalledTimes(2)
    expect(mediaDevices.live.size).toBe(1)
    expect(vm.api.stream.value).toBeDefined()

    vm.unmount()
  })
})
