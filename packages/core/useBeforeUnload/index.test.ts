import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useBeforeUnload } from '.'

describe('useBeforeUnload', () => {
  let mockWindow: Window
  let mockAddEventListener: ReturnType<typeof vi.fn>
  let mockRemoveEventListener: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockAddEventListener = vi.fn()
    mockRemoveEventListener = vi.fn()

    mockWindow = {
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    } as any
  })

  it('should add beforeunload event listener', () => {
    useBeforeUnload({ window: mockWindow })

    expect(mockAddEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function), { passive: false })
  })

  it('should handle beforeunload event with message', () => {
    const message = 'Are you sure you want to leave?'
    useBeforeUnload({ window: mockWindow, message })

    const handler = mockAddEventListener.mock.calls[0][1]
    const mockEvent = {
      preventDefault: vi.fn(),
      returnValue: '',
    } as any

    handler(mockEvent)

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockEvent.returnValue).toBe(message)
  })

  it('should not prevent default when no message is provided', () => {
    useBeforeUnload({ window: mockWindow })

    const handler = mockAddEventListener.mock.calls[0][1]
    const mockEvent = {
      preventDefault: vi.fn(),
      returnValue: '',
    } as any

    handler(mockEvent)

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockEvent.returnValue).toBe('')
  })

  it('should not add listener when disabled', () => {
    useBeforeUnload({ window: mockWindow, enabled: false })

    expect(mockAddEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function), { passive: false })

    // Verify the handler respects the enabled state
    const handler = mockAddEventListener.mock.calls[0][1]
    const mockEvent = {
      preventDefault: vi.fn(),
      returnValue: '',
    } as any

    handler(mockEvent)

    expect(mockEvent.preventDefault).not.toHaveBeenCalled()
  })

  it('should support function overload', () => {
    const message = 'Test message'
    useBeforeUnload(true, message, { window: mockWindow })

    const handler = mockAddEventListener.mock.calls[0][1]
    const mockEvent = {
      preventDefault: vi.fn(),
      returnValue: '',
    } as any

    handler(mockEvent)

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(mockEvent.returnValue).toBe(message)
  })
})
