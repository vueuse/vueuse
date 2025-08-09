import { beforeEach, describe, expect, it } from 'vitest'
import { useMagicKeys } from './index'

interface disptchEventOptions extends Partial<KeyboardEvent> {
  key: string
  target: HTMLElement
  eventType?: 'keydown' | 'keyup'
}

function dispatchEvent(options: disptchEventOptions): void {
  const { eventType = 'keydown', target, key, ...args } = options
  target.dispatchEvent(new KeyboardEvent(eventType, { key, ...args }))
}

describe('useMagicKeys', () => {
  let target: HTMLInputElement
  beforeEach(() => {
    target = document.createElement('input')
  })
  it('single key', async () => {
    const { A } = useMagicKeys({ target })
    dispatchEvent({ target, key: 'A' })
    expect(A.value).toBe(true)
  })
  it('multiple keys', async () => {
    const { Ctrl_Shift_Period } = useMagicKeys({ target })
    expect(Ctrl_Shift_Period.value).toBe(false)

    dispatchEvent({ target, key: 'control', ctrlKey: true })
    expect(Ctrl_Shift_Period.value).toBe(false)

    dispatchEvent({ target, key: 'shift', ctrlKey: true, shiftKey: true })
    expect(Ctrl_Shift_Period.value).toBe(false)

    dispatchEvent({ target, key: 'Period', ctrlKey: true, shiftKey: true })
    expect(Ctrl_Shift_Period.value).toBe(true)
  })
  it('multiple keys(in a different order)', async () => {
    const { Ctrl_Shift_Period } = useMagicKeys({ target })
    expect(Ctrl_Shift_Period.value).toBe(false)

    dispatchEvent({ target, key: 'shift', shiftKey: true })
    expect(Ctrl_Shift_Period.value).toBe(false)

    dispatchEvent({ target, key: 'control', shiftKey: true, ctrlKey: true })
    expect(Ctrl_Shift_Period.value).toBe(false)

    dispatchEvent({ target, key: 'Period', shiftKey: true, ctrlKey: true })
    expect(Ctrl_Shift_Period.value).toBe(true)
  })
  it('prevent incorrect clearing of other keys after releasing shift', async () => {
    const { v, u, e, shift } = useMagicKeys({ target })

    dispatchEvent({ target, key: 'v' })
    dispatchEvent({ target, key: 'u' })
    dispatchEvent({ target, key: 'shift', shiftKey: true })
    dispatchEvent({ target, key: 'e', shiftKey: true })

    expect(v.value).toBe(true)
    expect(u.value).toBe(true)
    expect(shift.value).toBe(true)
    expect(e.value).toBe(true)

    // Clear key pressed after shift
    dispatchEvent({ target, eventType: 'keyup', key: 'shift', shiftKey: true })
    expect(v.value).toBe(true)
    expect(u.value).toBe(true)
    expect(e.value).toBe(false)
    expect(shift.value).toBe(false)
  })
  it('current return value', async () => {
    const { v, current } = useMagicKeys({ target })
    dispatchEvent({ target, key: 'V' })
    expect(v.value).toBe(true)
    expect(current.has('v')).toBe(true)
  })
  it('aliasMap option', async () => {
    const { ct } = useMagicKeys({ aliasMap: { ct: 'control' }, target })
    dispatchEvent({ target, key: 'Control', ctrlKey: true })
    expect(ct.value).toBe(true)
  })
})
