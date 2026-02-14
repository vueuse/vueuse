import type { KeyModifier } from './index'
import { describe, expect, it } from 'vitest'
import { dispatchKeyboardEvent } from '../../.test'
import { useKeyModifier } from './index'

/**
 * Assert useKeyModifier state
 */
function assertModifierState(key: KeyModifier, options: KeyboardEventInit) {
  const state = useKeyModifier(key)
  expect(state.value).toBe(null)

  dispatchKeyboardEvent({ key, ...options })
  expect(state.value).toBeTruthy()

  dispatchKeyboardEvent({ key, type: 'keyup' })
  expect(state.value).toBeFalsy()
}

describe('useKeyModifier', () => {
  it('should be defined', () => {
    expect(useKeyModifier).toBeDefined()
  })

  describe('all events', () => {
    const cases: Array<{ key: KeyModifier, options: KeyboardEventInit }> = [
      { key: 'Alt', options: { altKey: true } },
      { key: 'AltGraph', options: { modifierAltGraph: true } },
      { key: 'CapsLock', options: { modifierCapsLock: true } },
      { key: 'Control', options: { ctrlKey: true } },
      { key: 'Fn', options: { modifierFn: true } },
      { key: 'FnLock', options: { modifierFnLock: true } },
      { key: 'Meta', options: { metaKey: true } },
      { key: 'NumLock', options: { modifierNumLock: true } },
      { key: 'ScrollLock', options: { modifierScrollLock: true } },
      { key: 'Shift', options: { shiftKey: true } },
      { key: 'Symbol', options: { modifierSymbol: true } },
      { key: 'SymbolLock', options: { modifierSymbolLock: true } },
    ]

    it.for(cases)('should track state for %s', ({ key, options }) => {
      assertModifierState(key, options)
    })
  })

  describe('params', () => {
    describe('events', () => {
      it('should allow event to be specified', () => {
        const state = useKeyModifier('Alt', { events: ['mousedown'] })
        expect(state.value).toBe(null)

        document.dispatchEvent(new MouseEvent('mousedown', { altKey: true }))
        expect(state.value).toBeTruthy()

        document.dispatchEvent(new MouseEvent('mousedown', { altKey: false }))
        expect(state.value).toBeFalsy()
      })

      it('should be work with custom event', () => {
        const state = useKeyModifier('Alt', { events: ['click'] })
        expect(state.value).toBe(null)

        document.dispatchEvent(new MouseEvent('click', { altKey: true }))
        expect(state.value).toBeTruthy()

        document.dispatchEvent(new MouseEvent('click', { altKey: false }))
        expect(state.value).toBeFalsy()
      })
    })

    describe('initial', () => {
      it('should be null when initial value is default', () => {
        const state = useKeyModifier('Alt')
        expect(state.value).toBeNull()
      })

      it('should be true when initial value is true', () => {
        const state = useKeyModifier('Alt', { initial: true })
        expect(state.value).toBeTruthy()
      })

      it('should be false when initial value is false', () => {
        const state = useKeyModifier('Alt', { initial: false })
        expect(state.value).toBeFalsy()
      })

      it('should be null when initial value is null', () => {
        const state = useKeyModifier('Alt', { initial: null })
        expect(state.value).toBeFalsy()
      })
    })
  })
})
