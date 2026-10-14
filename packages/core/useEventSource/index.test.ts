import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, shallowRef } from 'vue'
import { useEventSource } from './index'

class MockEventSource extends EventTarget {
  readyState = 0
  onopen = vi.fn()
  onerror = vi.fn()

  close() {
    this.readyState = 2
  }
}

describe('useEventSource current connection', () => {
  let scope: ReturnType<typeof effectScope>

  beforeEach(() => {
    scope = effectScope()
    vi.stubGlobal('EventSource', MockEventSource)
    vi.useFakeTimers()
  })

  afterEach(() => {
    scope.stop()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('ignores open and error callbacks from a superseded connection', () => {
    const result = scope.run(() => useEventSource('https://localhost', [], {
      autoReconnect: { delay: 1000 },
    }))!
    const oldSource = result.eventSource.value!
    result.open()
    const currentSource = result.eventSource.value!
    const error = new Event('error')
    currentSource.onerror!(error)

    oldSource.onopen!(new Event('open'))
    expect(result.status.value).toBe('CLOSED')
    expect(result.error.value).toBe(error)

    currentSource.onopen!(new Event('open'))
    oldSource.onerror!(new Event('error'))
    expect(result.status.value).toBe('OPEN')
    expect(result.error.value).toBeNull()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('keeps current data and event IDs when the URL changes', async () => {
    const url = shallowRef('https://localhost/first')
    const result = scope.run(() => useEventSource(url, ['update']))!
    const oldSource = result.eventSource.value!
    url.value = 'https://localhost/second'
    await nextTick()
    const currentSource = result.eventSource.value!

    currentSource.dispatchEvent(new MessageEvent('update', {
      data: 'current',
      lastEventId: '2',
    }))
    oldSource.dispatchEvent(new MessageEvent('update', {
      data: 'stale',
      lastEventId: '1',
    }))

    expect(result.eventSource.value).toBe(currentSource)
    expect(result.event.value).toBe('update')
    expect(result.data.value).toBe('current')
    expect(result.lastEventId.value).toBe('2')
  })

  it('ignores default messages after close', () => {
    const result = scope.run(() => useEventSource('https://localhost'))!
    const source = result.eventSource.value!
    result.close()
    source.dispatchEvent(new MessageEvent('message', {
      data: 'stale',
      lastEventId: '1',
    }))

    expect(result.status.value).toBe('CLOSED')
    expect(result.data.value).toBeNull()
    expect(result.event.value).toBeNull()
    expect(result.lastEventId.value).toBeNull()
  })
})
