import type { WindowEventName } from '@vueuse/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useIdle } from '.'

describe('useIdle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
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

  it('should reset idle state on user activity', () => {
    const timeout = 1000
    const { idle } = useIdle(timeout)

    vi.advanceTimersByTime(timeout)
    expect(idle.value).toBe(true)

    // Simulate user activity
    window.dispatchEvent(new MouseEvent('mousemove'))
    expect(idle.value).toBe(false)

    // Should become idle again after timeout
    vi.advanceTimersByTime(timeout)
    expect(idle.value).toBe(true)
  })

  it('should accept custom events list', () => {
    const timeout = 1000
    const customEvents: WindowEventName[] = ['click', 'keypress']
    const { idle } = useIdle(timeout, { events: customEvents })

    vi.advanceTimersByTime(timeout)
    expect(idle.value).toBe(true)

    // Should not respond to mousemove (not in custom events)
    window.dispatchEvent(new MouseEvent('mousemove'))
    expect(idle.value).toBe(true)

    // Should respond to click (in custom events)
    window.dispatchEvent(new MouseEvent('click'))
    expect(idle.value).toBe(false)
  })

  it('should respect initialState option', () => {
    const { idle } = useIdle(1000, { initialState: true })
    expect(idle.value).toBe(true)
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

    // Should remain in initialState (false)
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

  it('should update lastActive timestamp on activity', () => {
    const timeout = 1000
    const { lastActive } = useIdle(timeout)
    const initialTime = lastActive.value

    // Advance time and simulate activity
    vi.advanceTimersByTime(500)
    window.dispatchEvent(new MouseEvent('mousemove'))

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

  it('should use initialState when starting after start', () => {
    const { idle, stop, start } = useIdle(1000, { initialState: true })

    expect(idle.value).toBe(true)

    window.dispatchEvent(new MouseEvent('mousemove'))
    expect(idle.value).toBe(false)

    stop()
    expect(idle.value).toBe(true)

    start()
    expect(idle.value).toBe(true)

    vi.advanceTimersByTime(51)
    window.dispatchEvent(new MouseEvent('mousemove'))
    expect(idle.value).toBe(false)
  })

  it('should handle false initialState correctly', () => {
    const { idle, stop, start } = useIdle(1000, { initialState: false })

    // Initially idle should be false
    expect(idle.value).toBe(false)

    // After timeout, should become idle
    vi.advanceTimersByTime(1000)
    expect(idle.value).toBe(true)

    // Stop should set idle to initialState (false)
    stop()
    expect(idle.value).toBe(false)

    // Start should reset to non-idle state (false)
    start()
    expect(idle.value).toBe(false)
  })
})
