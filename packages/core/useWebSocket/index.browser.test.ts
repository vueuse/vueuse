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

    it('should support delay as a number', () => {
      const { ws, status } = useWebSocket('ws://localhost', {
        autoReconnect: {
          retries: 2,
          delay: 2500,
        },
      })

      ws.value?.onopen?.(new Event('open'))
      ws.value?.onclose?.(new CloseEvent('close'))

      expect(status.value).toBe('CLOSED')

      // Should use the specified delay time
      vi.advanceTimersByTime(2499)
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(1)
      expect(status.value).toBe('CONNECTING')
    })

    it('should support delay as a function', () => {
      const delayFn = vi.fn((retries: number) => retries * 1000)
      const { ws, status } = useWebSocket('ws://localhost', {
        autoReconnect: {
          retries: 2,
          delay: delayFn,
        },
      })

      ws.value?.onopen?.(new Event('open'))
      ws.value?.onclose?.(new CloseEvent('close'))

      // Should call delay function with retry count
      expect(delayFn).toHaveBeenCalledWith(1)
      expect(status.value).toBe('CLOSED')

      // Should use the returned delay time
      const returnedDelay = delayFn.mock.results[0].value
      vi.advanceTimersByTime(returnedDelay - 1)
      expect(status.value).toBe('CLOSED')
      vi.advanceTimersByTime(1)
      expect(status.value).toBe('CONNECTING')
    })
  })
})
