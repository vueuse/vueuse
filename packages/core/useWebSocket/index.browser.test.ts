import { useWebSocket } from '@vueuse/core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('useWebSocket', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('autoReconnect', () => {
    const AUTO_RECONNECT_DELAY = 1000

    it('should reconnect if autoReconnect is true', () => {
      const { ws, status } = useWebSocket('ws://localhost', {
        autoReconnect: true,
      })

      ws.value?.onopen?.(new Event('open'))

      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(AUTO_RECONNECT_DELAY)

      expect(status.value).toBe('CONNECTING')
    })

    it('should not reconnect if autoReconnect is false', () => {
      const { ws, status } = useWebSocket('ws://localhost', {
        autoReconnect: false,
      })

      ws.value?.onopen?.(new Event('open'))

      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(AUTO_RECONNECT_DELAY)

      expect(status.value).toBe('CLOSED')
    })

    it('should call onFailed if autoReconnect is not false', () => {
      const onFailed = vi.fn()
      const { ws, status } = useWebSocket('ws://localhost', {
        autoReconnect: {
          retries: () => false,
          onFailed,
        },
      })

      ws.value?.onopen?.(new Event('open'))

      ws.value?.onclose?.(new CloseEvent('close'))

      expect(onFailed).toHaveBeenCalled()
      expect(status.value).toBe('CLOSED')
    })

    it('should reconnect if autoReconnect.retries is number', () => {
      const { ws, status } = useWebSocket('ws://localhost', {
        autoReconnect: {
          retries: 2,
        },
      })

      ws.value?.onopen?.(new Event('open'))

      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(AUTO_RECONNECT_DELAY)

      expect(status.value).toBe('CONNECTING')
    })

    it('should reconnect if autoReconnect.retries is function', () => {
      const { ws, status } = useWebSocket('ws://localhost', {
        autoReconnect: {
          retries: retried => retried < 1,
        },
      })

      ws.value?.onopen?.(new Event('open'))

      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(AUTO_RECONNECT_DELAY)

      expect(status.value).toBe('CONNECTING')
    })

    it('should support delay as a function', () => {
      const delayFn = vi.fn((retries: number) => retries * 1000)
      const { ws, status } = useWebSocket('ws://localhost', {
        autoReconnect: {
          retries: 3,
          delay: delayFn,
        },
      })

      ws.value?.onopen?.(new Event('open'))

      // First reconnection: delay should be 1000ms (retries = 1)
      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      expect(delayFn).not.toHaveBeenCalled()
      vi.advanceTimersByTime(999)
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(1)
      expect(delayFn).toHaveBeenCalledWith(1)
      expect(status.value).toBe('CONNECTING')

      ws.value?.onopen?.(new Event('open'))

      // Second reconnection: delay should be 2000ms (retries = 2)
      delayFn.mockClear()
      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(1999)
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(1)
      expect(delayFn).toHaveBeenCalledWith(2)
      expect(status.value).toBe('CONNECTING')

      ws.value?.onopen?.(new Event('open'))

      // Third reconnection: delay should be 3000ms (retries = 3)
      delayFn.mockClear()
      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(2999)
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(1)
      expect(delayFn).toHaveBeenCalledWith(3)
      expect(status.value).toBe('CONNECTING')
    })

    it('should support exponential backoff', () => {
      const { ws, status } = useWebSocket('ws://localhost', {
        autoReconnect: {
          retries: 3,
          delay: retries => 1000 * 2 ** (retries - 1), // 1s, 2s, 4s
        },
      })

      ws.value?.onopen?.(new Event('open'))

      // First reconnection: 1000ms
      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(1000)
      expect(status.value).toBe('CONNECTING')

      ws.value?.onopen?.(new Event('open'))

      // Second reconnection: 2000ms
      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(2000)
      expect(status.value).toBe('CONNECTING')

      ws.value?.onopen?.(new Event('open'))

      // Third reconnection: 4000ms
      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(4000)
      expect(status.value).toBe('CONNECTING')
    })
  })
})
