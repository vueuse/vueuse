import type { WindowEventName } from '@vueuse/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { isReadonly, nextTick, shallowRef } from 'vue'
import { useIdle } from '.'

describe('useIdle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with correct default values', () => {
    const { idle, lastActive } = useIdle(60_000)

    expect(idle.value).toBe(false)
    expect(lastActive.value).toBeTypeOf('number')
  })

  it('should become idle after timeout', () => {
    const timeout = 1000
    const { idle } = useIdle(timeout)

    expect(idle.value).toBe(false)

    vi.advanceTimersByTime(timeout)

    expect(idle.value).toBe(true)
  })

  it('should reset idle state on user activity', async () => {
    const timeout = 1000
    const { idle } = useIdle(timeout)

    vi.advanceTimersByTime(timeout)
    expect(idle.value).toBe(true)

    // Simulate user activity
    await userEvent.keyboard('foo')
    expect(idle.value).toBe(false)

    // Should become idle again after timeout
    // todo: why +50?
    vi.advanceTimersByTime(timeout + 50)
    expect(idle.value).toBe(true)
  })

  it('should update lastActive only when reset is called with resetLastActive', () => {
    const timeout = 1000
    const { idle, lastActive, reset } = useIdle(timeout)
    const initialLastActive = lastActive.value

    vi.advanceTimersByTime(timeout)
    expect(idle.value).toBe(true)

    reset()
    expect(idle.value).toBe(false)
    expect(lastActive.value).toBe(initialLastActive)

    vi.advanceTimersByTime(timeout)
    expect(idle.value).toBe(true)

    reset(true)
    expect(idle.value).toBe(false)
    expect(lastActive.value).toBe(initialLastActive + 2 * timeout)

    vi.advanceTimersByTime(timeout)
    expect(idle.value).toBe(true)
  })

  it('should accept custom events list', async () => {
    document.body.innerHTML = ''
    const button = document.createElement('button')
    document.body.appendChild(button)

    const timeout = 1000
    const customEvents: WindowEventName[] = ['click', 'keypress']
    const { idle } = useIdle(timeout, { events: customEvents })

    vi.advanceTimersByTime(timeout)
    expect(idle.value).toBe(true)

    // Should not respond to mousemove (not in custom events)
    await userEvent.hover(button)
    expect(idle.value).toBe(true)

    // Should respond to click (in custom events)
    await userEvent.click(button)
    await nextTick()
    expect(idle.value).toBe(false)
  })

  it('should return readonly refs', () => {
    const { idle, lastActive } = useIdle(1000)

    expect(isReadonly(idle)).toBe(true)
    expect(isReadonly(lastActive)).toBe(true)
  })

  describe('initials', () => {
    it('should default lastActive to now', () => {
      const { lastActive } = useIdle(1000)

      expect(lastActive.value).toBe(Date.now())
    })

    it('should seed from plain values', () => {
      const { idle, lastActive } = useIdle(1000, { initials: { idle: true, lastActive: 42 } })

      expect(idle.value).toBe(true)
      expect(lastActive.value).toBe(42)
    })

    it('should use passed refs as internal state', async () => {
      const idle = shallowRef(true)
      const lastActive = shallowRef(0)
      const result = useIdle(1000, { initials: { idle, lastActive } })

      expect(result.idle).not.toBe(idle)

      await userEvent.keyboard('foo')
      expect(idle.value).toBe(false)
      expect(lastActive.value).toBe(Date.now())

      lastActive.value = 1
      expect(result.lastActive.value).toBe(1)
    })

    it('should reset to the initial idle value on stop', async () => {
      const { idle, stop } = useIdle(1000, { initials: { idle: true } })

      await userEvent.keyboard('foo')
      expect(idle.value).toBe(false)

      stop()
      expect(idle.value).toBe(true)
    })

    it('should support deprecated initialState', () => {
      const { idle } = useIdle(1000, { initialState: true })

      expect(idle.value).toBe(true)
    })

    it('should prefer initials over deprecated initialState', () => {
      const { idle } = useIdle(1000, { initialState: true, initials: { idle: false } })

      expect(idle.value).toBe(false)
    })
  })

  it('should handle visibility change events', () => {
    const timeout = 1000
    const { idle } = useIdle(timeout)

    vi.advanceTimersByTime(timeout)
    expect(idle.value).toBe(true)

    Object.defineProperty(document, 'hidden', { value: false, writable: true })
    document.dispatchEvent(new Event('visibilitychange'))

    expect(idle.value).toBe(false)
  })

  it('should ignore visibility change events while the document is hidden', () => {
    const timeout = 1000
    const { idle } = useIdle(timeout)

    vi.advanceTimersByTime(timeout)
    expect(idle.value).toBe(true)

    Object.defineProperty(document, 'hidden', { value: true, writable: true })
    document.dispatchEvent(new Event('visibilitychange'))
    Object.defineProperty(document, 'hidden', { value: false, writable: true })

    expect(idle.value).toBe(true)
  })

  it('should not respond to visibility change when disabled', () => {
    const timeout = 1000
    const { idle } = useIdle(timeout, { listenForVisibilityChange: false })

    vi.advanceTimersByTime(timeout)
    expect(idle.value).toBe(true)

    Object.defineProperty(document, 'hidden', { value: false, writable: true })
    document.dispatchEvent(new Event('visibilitychange'))

    expect(idle.value).toBe(true)
  })

  it('should properly cleanup timers on stop', () => {
    const timeout = 1000
    const { idle, stop } = useIdle(timeout)

    expect(idle.value).toBe(false)

    stop()
    vi.advanceTimersByTime(timeout)

    // Should remain in initials.idle (false)
    expect(idle.value).toBe(false)
  })

  it('should properly restart after stopping', () => {
    const timeout = 1000
    const { idle, stop, start } = useIdle(timeout)

    vi.advanceTimersByTime(timeout)
    expect(idle.value).toBe(true)

    stop()
    expect(idle.value).toBe(false)

    start()
    expect(idle.value).toBe(false)

    vi.advanceTimersByTime(timeout)
    expect(idle.value).toBe(true)
  })

  it('should update lastActive timestamp on activity', async () => {
    const timeout = 1000
    const { lastActive } = useIdle(timeout)
    const initialTime = lastActive.value

    // Advance time and simulate activity
    vi.advanceTimersByTime(500)
    await userEvent.keyboard('foo')

    // Should have updated the lastActive time
    expect(lastActive.value).toBeGreaterThan(initialTime)
  })

  it('should reset idle state with reset method', () => {
    const timeout = 1000
    const { idle, reset } = useIdle(timeout)

    vi.advanceTimersByTime(timeout)
    expect(idle.value).toBe(true)

    reset()
    expect(idle.value).toBe(false)

    vi.advanceTimersByTime(timeout)
    expect(idle.value).toBe(true)
  })

  it('should set isPending to true when started', () => {
    const { isPending, stop, start } = useIdle(1000)

    expect(isPending.value).toBe(true)

    stop()
    expect(isPending.value).toBe(false)

    start()
    expect(isPending.value).toBe(true)
  })

  it('should set isPending to false when stopped', () => {
    const { isPending, stop } = useIdle(1000)

    expect(isPending.value).toBe(true)

    stop()
    expect(isPending.value).toBe(false)
  })

  it('should use initials.idle when starting after start', async () => {
    const { idle, stop, start } = useIdle(1000, { initials: { idle: true } })

    expect(idle.value).toBe(true)

    await userEvent.keyboard('foo')
    expect(idle.value).toBe(false)

    stop()
    expect(idle.value).toBe(true)

    start()
    expect(idle.value).toBe(true)

    vi.advanceTimersByTime(51)
    await userEvent.keyboard('foo')
    expect(idle.value).toBe(false)
  })

  it('should handle false initials.idle correctly', () => {
    const { idle, stop, start } = useIdle(1000, { initials: { idle: false } })

    // Initially idle should be false
    expect(idle.value).toBe(false)

    // After timeout, should become idle
    vi.advanceTimersByTime(1000)
    expect(idle.value).toBe(true)

    // Stop should set idle to initials.idle (false)
    stop()
    expect(idle.value).toBe(false)

    // Start should reset to non-idle state (false)
    start()
    expect(idle.value).toBe(false)
  })
})
