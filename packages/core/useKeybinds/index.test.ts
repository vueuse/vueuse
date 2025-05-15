import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useEventListener } from '../useEventListener'
import { useKeybinds } from './index'
import { createDefaultNormalizeCombinedKeyCode } from './internal'

vi.mock('../useEventListener', { spy: true })

describe('useKeybinds', () => {
  it('should be defined', () => {
    expect(useKeybinds).toBeDefined()
  })

  describe('handler', () => {
    let target: HTMLDivElement

    beforeEach(() => {
      target = document.createElement('div')
    })

    it('should propagate options to useEventListener', () => {
      const event = 'keypress'

      useKeybinds({}, {
        target,
        event,
      })

      expect(useEventListener).toHaveBeenCalledExactlyOnceWith(target, event, expect.any(Function), true)
    })

    it.each([
      ['KeyG', { code: 'KeyG', key: 'g' }],
      ['alt_KeyG', { code: 'KeyG', key: 'g', altKey: true }],
      ['ctrl_KeyG', { code: 'KeyG', key: 'g', ctrlKey: true }],
      ['meta_KeyG', { code: 'KeyG', key: 'g', metaKey: true }],
      ['shift_KeyG', { code: 'KeyG', key: 'g', shiftKey: true }],
      ['alt_ctrl_meta_shift_KeyG', { code: 'KeyG', key: 'g', altKey: true, ctrlKey: true, metaKey: true, shiftKey: true }],
    ])('should trigger on matching event (%s)', (key, eventData) => {
      const handler = vi.fn()

      useKeybinds(
        {
          [key]: handler,
        },
        {
          target,
          event: 'keydown',
          normalizeCombinedKeyCode: createDefaultNormalizeCombinedKeyCode({ macOS: true }),
        },
      )

      target.dispatchEvent(new KeyboardEvent('keydown', eventData))

      expect(handler).toBeCalledTimes(1)
    })

    it('should trigger on matching event sequence', () => {
      const handler = vi.fn()

      useKeybinds(
        {
          'alt_KeyK-alt_KeyJ': handler,
        },
        {
          target,
          event: 'keydown',
        },
      )

      target.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', altKey: true }))
      const lastEvent = new KeyboardEvent('keydown', { code: 'KeyJ', altKey: true })
      target.dispatchEvent(lastEvent)

      expect(handler).toBeCalledTimes(1)
      expect(handler).toHaveBeenCalledWith({ lastEvent })
    })

    it('should trigger sequence with increased delay limit', () => {
      vi.useFakeTimers()
      const handler = vi.fn()

      useKeybinds(
        {
          'alt_KeyK-alt_KeyJ': handler,
        },
        {
          target,
          event: 'keydown',
          sequenceDelayMs: 1000,
        },
      )

      target.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', altKey: true }))
      vi.advanceTimersByTime(500)
      target.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyJ', altKey: true }))

      expect(handler).toBeCalledTimes(1)
    })

    it('should not trigger sequence after delay limit', () => {
      vi.useFakeTimers()
      const handler = vi.fn()

      useKeybinds(
        {
          'alt_KeyK-alt_KeyJ': handler,
        },
        {
          target,
          event: 'keydown',
        },
      )

      target.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', altKey: true }))
      vi.advanceTimersByTime(500)
      target.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyJ', altKey: true }))

      expect(handler).toBeCalledTimes(0)
    })

    it('should trigger on repeated usage', () => {
      vi.useFakeTimers()
      const handler = vi.fn()

      useKeybinds(
        {
          'alt_KeyK-alt_KeyJ': handler,
        },
        {
          target,
          event: 'keydown',
        },
      )

      target.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', altKey: true }))
      target.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyJ', altKey: true }))

      expect(handler).toBeCalledTimes(1)

      target.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', altKey: true }))
      target.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyJ', altKey: true }))

      expect(handler).toBeCalledTimes(2)

      target.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', altKey: true }))
      target.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyJ', altKey: true }))

      expect(handler).toBeCalledTimes(3)
    })

    it('should normalize meta key modifier', () => {
      const handler = vi.fn()

      useKeybinds(
        {
          meta_KeyK: handler,
        },
        {
          target,
          event: 'keydown',
          normalizeCombinedKeyCode: createDefaultNormalizeCombinedKeyCode({ macOS: false }),
        },
      )

      target.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', ctrlKey: true }))

      expect(handler).toBeCalledTimes(1)
    })

    it('should normalize meta key modifier and override key', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      useKeybinds(
        {
          ctrl_KeyK: handler1,
          meta_KeyK: handler2,
        },
        {
          target,
          event: 'keydown',
          normalizeCombinedKeyCode: createDefaultNormalizeCombinedKeyCode({ macOS: false }),
        },
      )

      target.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyK', ctrlKey: true }))

      expect(handler1).toBeCalledTimes(0)
      expect(handler2).toBeCalledTimes(1)
    })
  })
})
