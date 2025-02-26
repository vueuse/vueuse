import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEventSource } from './index'

class MockEventSource extends EventTarget {
  readyState: number = 0
  url: string = ''
  withCredentials: boolean = false
  readonly CONNECTING = 0 as const
  readonly OPEN = 1 as const
  readonly CLOSED = 2 as const

  constructor() {
    super();
    (this as EventSource).addEventListener('error', this.onerror);
    (this as EventSource).addEventListener('message', this.onmessage)
    this.addEventListener('open', this.onopen)
  }

  onerror(_ev: Event) {
  }

  onmessage(_ev: MessageEvent) {
  }

  onopen(_ev: Event) {
  }

  close() {
    this.readyState = this.CLOSED
  }
}

describe('useEventSource', () => {
  beforeEach(() => {
    vi.stubGlobal('EventSource', MockEventSource)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(useEventSource).toBeDefined()
  })

  it('does not connect if no url', () => {
    const { status } = useEventSource(undefined)

    expect(status.value).toBe('CONNECTING')
  })

  it('sets event source when URL is defined', () => {
    const { eventSource } = useEventSource('https://localhost')

    expect(eventSource.value).toBeDefined()
    expect(eventSource.value).toBeInstanceOf(MockEventSource)
  })

  it('sets status to OPEN on open', () => {
    const { status, eventSource } = useEventSource('https://localhost')

    eventSource.value!.onopen!(new Event('open'))

    expect(status.value).toBe('OPEN')
  })

  it('sets status to CLOSED on error', () => {
    const { status, eventSource, error } = useEventSource('https://localhost', [], { autoReconnect: false })

    const source = eventSource.value!
    const err = new Event('error')

    source.onopen!(new Event('open'))
    source.onerror!(err)

    expect(status.value).toBe('CLOSED')
    expect(error.value).toBe(err)
  })

  it('sets data on message', () => {
    const { data, eventSource, lastEventId } = useEventSource('https://localhost')

    const source = eventSource.value!

    source.onmessage!(new MessageEvent('message', {
      data: 'bleep',
      lastEventId: '303',
    }))

    expect(data.value).toBe('bleep')
    expect(lastEventId.value).toBe('303')
  })

  it('can set non-string data', () => {
    const { data, eventSource } = useEventSource('https://localhost')

    const source = eventSource.value!
    const eventData = { some: { complex: 'data' } }

    source.onmessage!(new MessageEvent('message', { data: eventData }))

    expect(data.value).toBe(eventData)
  })

  it('can set data from custom events', () => {
    const { data, eventSource, event } = useEventSource('https://localhost', [
      'custom-event',
    ])

    const source = eventSource.value!

    source.dispatchEvent(new MessageEvent('custom-event', {
      data: 'bloop',
    }))

    expect(event.value).toBe('custom-event')
    expect(data.value).toBe('bloop')
  })

  it('can manually open()', () => {
    const { status, eventSource, open } = useEventSource('https://localhost', [], {
      immediate: false,
    })

    open()

    eventSource.value!.onopen!(new Event('open'))

    expect(status.value).toBe('OPEN')
  })

  it('can manually close()', () => {
    const { status, eventSource, close } = useEventSource('https://localhost')

    const source = eventSource.value!

    source.onopen!(new Event('open'))

    close()

    expect(status.value).toBe('CLOSED')
  })
})
