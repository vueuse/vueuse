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

    it('should use fixed delay when backoff is false', () => {
      const { ws, status } = useWebSocket('ws://localhost', {
        autoReconnect: {
          retries: 3,
          delay: 1000,
          backoff: false,
        },
      })

      ws.value?.onopen?.(new Event('open'))

      // First reconnect - should use fixed delay of 1000ms
      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(1000)
      expect(status.value).toBe('CONNECTING')

      // Second reconnect - should still use fixed delay of 1000ms
      ws.value?.onopen?.(new Event('open'))
      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(1000)
      expect(status.value).toBe('CONNECTING')
    })

    it('should use exponential backoff when backoff is true', () => {
      const { ws, status } = useWebSocket('ws://localhost', {
        autoReconnect: {
          retries: 3,
          delay: 1000,
          backoff: true,
        },
      })

      ws.value?.onopen?.(new Event('open'))

      // First reconnect - delay should be 1000ms (1000 * 2^0)
      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(1000)
      expect(status.value).toBe('CONNECTING')

      // Second reconnect - delay should be 2000ms (1000 * 2^1)
      ws.value?.onopen?.(new Event('open'))
      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(2000)
      expect(status.value).toBe('CONNECTING')

      // Third reconnect - delay should be 4000ms (1000 * 2^2)
      ws.value?.onopen?.(new Event('open'))
      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(4000)
      expect(status.value).toBe('CONNECTING')
    })

    it('should reset retry count on successful connection with backoff', () => {
      const { ws, status } = useWebSocket('ws://localhost', {
        autoReconnect: {
          retries: 3,
          delay: 1000,
          backoff: true,
        },
      })

      ws.value?.onopen?.(new Event('open'))

      // First reconnect - delay should be 1000ms
      ws.value?.onclose?.(new CloseEvent('close'))
      vi.advanceTimersByTime(1000)
      expect(status.value).toBe('CONNECTING')

      // Second reconnect - delay should be 2000ms
      ws.value?.onopen?.(new Event('open'))
      ws.value?.onclose?.(new CloseEvent('close'))
      vi.advanceTimersByTime(2000)
      expect(status.value).toBe('CONNECTING')

      // Successful connection should reset retry count
      ws.value?.onopen?.(new Event('open'))
      expect(status.value).toBe('OPEN')

      // Next reconnect should start from base delay again (1000ms)
      ws.value?.onclose?.(new CloseEvent('close'))
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(1000)
      expect(status.value).toBe('CONNECTING')
    })
  })
})
