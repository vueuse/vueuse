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

    it('should not update status from stale websocket on open', () => {
      const { ws, status, open } = useWebSocket('ws://localhost', {
        immediate: true,
      })

      const oldWs = ws.value

      open()

      expect(ws.value).not.toBe(oldWs)
      expect(status.value).toBe('CONNECTING')

      // Simulate stale websocket opening after new connection was created
      oldWs?.onopen?.(new Event('open'))

      expect(status.value).toBe('CONNECTING')

      ws.value?.onopen?.(new Event('open'))
      expect(status.value).toBe('OPEN')
    })

    it('should not update status from stale websocket on close', () => {
      const { ws, status, open } = useWebSocket('ws://localhost', {
        immediate: true,
      })

      ws.value?.onopen?.(new Event('open'))
      expect(status.value).toBe('OPEN')

      const oldWs = ws.value

      open()

      expect(ws.value).not.toBe(oldWs)
      expect(status.value).toBe('CONNECTING')

      ws.value?.onopen?.(new Event('open'))
      expect(status.value).toBe('OPEN')

      // Simulate stale websocket closing after new connection is open
      oldWs?.onclose?.(new CloseEvent('close'))

      expect(status.value).toBe('OPEN')
    })
  })
})
