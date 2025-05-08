import { beforeEach, describe, expect, it } from 'vitest'
import { useMagicKeys } from './index'

describe('useMagicKeys', () => {
  let target: HTMLInputElement
  beforeEach(() => {
    target = document.createElement('input')
  })
  it('single key', async () => {
    const { A } = useMagicKeys({ target })

    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'A',
    }))

    expect(A.value).toBe(true)
  })
  it('multiple keys', async () => {
    const { Ctrl_Shift_Period } = useMagicKeys({ target })
    expect(Ctrl_Shift_Period.value).toBe(false)

    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'control',
      ctrlKey: true,
    }))
    expect(Ctrl_Shift_Period.value).toBe(false)

    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'shift',
      ctrlKey: true,
      shiftKey: true,
    }))
    expect(Ctrl_Shift_Period.value).toBe(false)

    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Period',
      ctrlKey: true,
      shiftKey: true,
    }))
    expect(Ctrl_Shift_Period.value).toBe(true)
  })
  it('multiple keys(in a different order)', async () => {
    const { Ctrl_Shift_Period } = useMagicKeys({ target })
    expect(Ctrl_Shift_Period.value).toBe(false)

    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'shift',
      shiftKey: true,
    }))
    expect(Ctrl_Shift_Period.value).toBe(false)

    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'control',
      ctrlKey: true,
      shiftKey: true,
    }))
    expect(Ctrl_Shift_Period.value).toBe(false)

    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Period',
      ctrlKey: true,
      shiftKey: true,
    }))
    expect(Ctrl_Shift_Period.value).toBe(true)
  })
  it('macos command key combinations with double keydown', async () => {
    // #3026: doesn't trigger on releasing and pressing again the second key in a combination
    const { Meta_Z } = useMagicKeys({ target })
    expect(Meta_Z.value).toBe(false)

    // Simulate first keydown of command key
    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Meta',
      metaKey: true,
    }))
    expect(Meta_Z.value).toBe(false)

    // Simulate first keydown of Z
    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'z',
      metaKey: true,
    }))
    expect(Meta_Z.value).toBe(true) // true because of the first keydown of command key + z
    await new Promise(resolve => setTimeout(resolve, 1))
    expect(Meta_Z.value).toBe(true) // after 1ms, it's still true

    // Simulate second keydown of Z without keyup (macOS behavior)
    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'z',
      metaKey: true,
    }))
    expect(Meta_Z.value).toBe(false) // false because it has to manually trigger keyup event
    await new Promise(resolve => setTimeout(resolve, 1))
    expect(Meta_Z.value).toBe(true) // after 1ms, it's true again

    // Simulate keyup of Z
    target.dispatchEvent(new KeyboardEvent('keyup', {
      key: 'z',
      metaKey: true,
    }))
    expect(Meta_Z.value).toBe(false)

    // Simulate keyup of command key
    target.dispatchEvent(new KeyboardEvent('keyup', {
      key: 'Meta',
      metaKey: false,
    }))
    expect(Meta_Z.value).toBe(false)
  })
})
