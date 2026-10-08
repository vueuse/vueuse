import { describe, expect, it, vi } from 'vitest'
import { useRafFn } from './index'

function createFrames() {
  let id = 0
  const pending = new Map<number, FrameRequestCallback>()
  const window = {
    requestAnimationFrame: vi.fn((callback: FrameRequestCallback) => {
      pending.set(++id, callback)
      return id
    }),
    cancelAnimationFrame: vi.fn((frame: number) => pending.delete(frame)),
  } as unknown as Window

  function advance(timestamp: number) {
    const frames = [...pending.entries()]
    for (const [id, callback] of frames) {
      pending.delete(id)
      callback(timestamp)
    }
  }

  return { window, pending, advance }
}

describe('useRafFn callback controls', () => {
  it('does not schedule another frame when paused inside the callback', () => {
    const { window, pending, advance } = createFrames()
    const controls = useRafFn(() => controls.pause(), { window })

    advance(16)

    expect(controls.isActive.value).toBe(false)
    expect(pending.size).toBe(0)
  })

  it('keeps one animation loop when restarted inside the callback', () => {
    const { window, pending, advance } = createFrames()
    let controls: ReturnType<typeof useRafFn>
    const callback = vi.fn(() => {
      if (callback.mock.calls.length === 1) {
        controls.pause()
        controls.resume()
      }
    })
    controls = useRafFn(callback, { window })

    advance(16)
    expect(pending.size).toBe(1)
    advance(32)
    expect(callback).toHaveBeenCalledTimes(2)
    expect(pending.size).toBe(1)

    controls.pause()
    expect(pending.size).toBe(0)
  })
})
