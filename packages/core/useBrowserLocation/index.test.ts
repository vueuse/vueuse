import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useBrowserLocation } from '.'

function createMockWindow(initialHref = 'http://localhost/') {
  const url = new URL(initialHref)

  const location = {
    hash: url.hash,
    host: url.host,
    hostname: url.hostname,
    href: url.href,
    pathname: url.pathname,
    port: url.port,
    protocol: url.protocol,
    search: url.search,
    origin: url.origin,
  }

  return {
    location,
    history: { state: null, length: 1 },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }
}

describe('useBrowserLocation', () => {
  it('should read initial location values', () => {
    const mockWindow = createMockWindow('http://localhost/path?q=1#anchor')
    const state = useBrowserLocation({ window: mockWindow as any })

    expect(state.value.href).toBe('http://localhost/path?q=1#anchor')
    expect(state.value.pathname).toBe('/path')
    expect(state.value.search).toBe('?q=1')
    expect(state.value.hash).toBe('#anchor')
  })

  it('should not revert a URL change made via history.replaceState before the first Vue flush', async () => {
    const mockWindow = createMockWindow('http://localhost/initial')

    useBrowserLocation({ window: mockWindow as any })

    // Simulate history.replaceState: URL changes without triggering popstate event
    mockWindow.location.href = 'http://localhost/replaced'
    mockWindow.location.pathname = '/replaced'

    // Wait for Vue Scheduler flush (watch() trigger)
    await nextTick()

    expect(mockWindow.location.href).toBe('http://localhost/replaced')
    expect(mockWindow.location.pathname).toBe('/replaced')
  })

  it('should not write any location property during plain initialization', async () => {
    const written: string[] = []
    const mockWindow = createMockWindow('http://localhost/')

    mockWindow.location = new Proxy(mockWindow.location, {
      set(target, key, value) {
        written.push(String(key));
        (target as any)[key] = value
        return true
      },
    })

    useBrowserLocation({ window: mockWindow as any })

    await nextTick()

    expect(written).toEqual([])
  })
})
