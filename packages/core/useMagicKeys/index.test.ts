import { beforeEach, describe, expect, it } from 'vitest'
import { useMagicKeys } from './index'

interface dispatchEventOptions extends Partial<KeyboardEvent> {
  key: string
  target: HTMLElement
  eventType?: 'keydown' | 'keyup'
}

function dispatchEvent(options: dispatchEventOptions): void {
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

  it('multiple keys(for MacOS meta won\'t trigger keyup)', async () => {
    const { command, a } = useMagicKeys({ target })
    expect(command.value).toBe(false)
    expect(a.value).toBe(false)

    dispatchEvent({ target, key: 'a' })
    expect(a.value).toBe(true)

    dispatchEvent({ target, key: 'Meta', metaKey: true })
    expect(command.value).toBe(true)

    dispatchEvent({ target, eventType: 'keyup', key: 'Meta', metaKey: true })
    expect(command.value).toBe(false)
    expect(a.value).toBe(false)

    // #977
    // After solving the release Command, repeatedly pressing the Command will trigger repeatedly
    dispatchEvent({ target, key: 'Meta', metaKey: true })
    expect(command.value).toBe(true)
    expect(a.value).toBe(false)
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
    const allKeys = [v.value, u.value, e.value, shift.value]
    expect(allKeys.every(val => val === false)).toBe(true)

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
    expect(v.value).toBe(false)
    dispatchEvent({ target, key: 'v' })

    expect(v.value).toBe(true)
    expect(current.has('v')).toBe(true)
  })

  it('alias map option', async () => {
    const { ct } = useMagicKeys({ aliasMap: { ct: 'control' }, target })
    expect(ct.value).toBe(false)

    dispatchEvent({ target, key: 'Control', ctrlKey: true })
    expect(ct.value).toBe(true)
  })

  it('use reactive mode', async () => {
    const keys = useMagicKeys({ target, reactive: true })
    expect(keys.a).toBe(false)
    dispatchEvent({ target, key: 'a' })

    expect(keys.a).toBe(true)
    expect(keys.current.has('a')).toBe(true)
  })

  it('target blur', async () => {
    // #1350
    const { alt_tab } = useMagicKeys({ target })
    expect(alt_tab.value).toBe(false)

    dispatchEvent({ target, key: 'Alt', altKey: true })
    dispatchEvent({ target, key: 'Tab', altKey: true })
    expect(alt_tab.value).toBe(true)

    window.dispatchEvent(new Event('blur'))
    expect(alt_tab.value).toBe(false)
  })

  it('target focus', async () => {
    // #1350
    const { alt_tab } = useMagicKeys({ target })
    expect(alt_tab.value).toBe(false)

    dispatchEvent({ target, key: 'Alt', altKey: true })
    dispatchEvent({ target, key: 'Tab', altKey: true })
    expect(alt_tab.value).toBe(true)

    window.dispatchEvent(new Event('focus'))
    expect(alt_tab.value).toBe(false)
  })
})
