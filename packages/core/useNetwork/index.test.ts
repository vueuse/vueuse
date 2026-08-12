import { describe, expect, it, vi } from 'vitest'
import { useNetwork } from '.'

function createMockWindow(connection?: unknown) {
  return {
    navigator: {
      onLine: true,
      ...(connection ? { connection } : {}),
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }
}

describe('useNetwork', () => {
  it('should be defined', () => {
    expect(useNetwork).toBeDefined()
  })

  it('should read connection information', () => {
    const mockWindow = createMockWindow({
      downlink: 10,
      effectiveType: '4g',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })

    const { isSupported, isOnline, downlink, effectiveType } = useNetwork({ window: mockWindow as any })

    expect(isSupported.value).toBe(true)
    expect(isOnline.value).toBe(true)
    expect(downlink.value).toBe(10)
    expect(effectiveType.value).toBe('4g')
  })

  it('should subscribe to connection changes when connection is an EventTarget', () => {
    const connection = {
      downlink: 10,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    const mockWindow = createMockWindow(connection)

    useNetwork({ window: mockWindow as any })

    expect(connection.addEventListener).toHaveBeenCalledWith('change', expect.any(Function), expect.objectContaining({ passive: true }))
  })

  it('should not throw when navigator.connection is not an EventTarget', () => {
    const mockWindow = createMockWindow({
      downlink: 5,
      effectiveType: '3g',
    })

    expect(() => useNetwork({ window: mockWindow as any })).not.toThrow()

    const { isOnline, downlink, effectiveType } = useNetwork({ window: mockWindow as any })

    expect(isOnline.value).toBe(true)
    expect(downlink.value).toBe(5)
    expect(effectiveType.value).toBe('3g')
  })
})
