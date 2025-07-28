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
  it('prevent incorrect clearing of other keys after releasing shift', async () => {
    const { v, u, e, shift } = useMagicKeys({ target })

    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'v',
    }))
    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'u',
    }))
    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'e',
    }))
    target.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'shift',
    }))

    expect(v.value).toBe(true)
    expect(u.value).toBe(true)
    expect(e.value).toBe(true)
    expect(shift.value).toBe(true)

    target.dispatchEvent(new KeyboardEvent('keyup', {
      key: 'shift',
    }))

    expect(v.value).toBe(true)
    expect(u.value).toBe(true)
    expect(e.value).toBe(true)
    expect(shift.value).toBe(false)
  })
})
