import { describe, expect, it, vi } from 'vitest'

import { useInternalClock } from '.'

describe('useInternalClock', () => {
  it('should be defined', () => {
    expect(useInternalClock).toBeDefined()
  })

  it('should tick once after one second', () => {
    vi.useFakeTimers()
    const start = new Date()
    const { currentTime } = useInternalClock()
    vi.advanceTimersToNextTimer()
    expect(currentTime.value).toStrictEqual(new Date(start.getTime() + 1000))
  })

  it('should tick twice after two seconds', () => {
    vi.useFakeTimers()
    const start = new Date()
    const { currentTime } = useInternalClock()
    vi.advanceTimersToNextTimer()
    vi.advanceTimersToNextTimer()
    expect(currentTime.value).toStrictEqual(new Date(start.getTime() + 2000))
  })

  it('should tick ten times after 10 seconds', () => {
    vi.useFakeTimers()
    const start = new Date()
    const { currentTime } = useInternalClock()
    vi.advanceTimersToNextTimer()
    vi.advanceTimersToNextTimer()
    vi.advanceTimersToNextTimer()
    vi.advanceTimersToNextTimer()
    vi.advanceTimersToNextTimer()
    vi.advanceTimersToNextTimer()
    vi.advanceTimersToNextTimer()
    vi.advanceTimersToNextTimer()
    vi.advanceTimersToNextTimer()
    vi.advanceTimersToNextTimer()
    expect(currentTime.value).toStrictEqual(new Date(start.getTime() + 10000))
  })
})
