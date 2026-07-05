import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useGamepad } from './index'

interface MockGamepad {
  id: string
  index: number
  connected: boolean
  mapping: GamepadMappingType
  timestamp: number
  vibrationActuator: GamepadHapticActuator | null
  hapticActuators: GamepadHapticActuator[]
  axes: number[]
  buttons: Array<{ pressed: boolean, touched: boolean, value: number }>
}

function createGamepad(index: number): MockGamepad {
  return {
    id: `gamepad-${index}`,
    index,
    connected: true,
    mapping: 'standard',
    timestamp: 0,
    vibrationActuator: null,
    hapticActuators: [],
    axes: [0, 0, 0, 0],
    buttons: [{ pressed: false, touched: false, value: 0 }],
  }
}

function dispatchGamepadEvent(type: 'gamepadconnected' | 'gamepaddisconnected', gamepad: MockGamepad) {
  const event = new Event(type)
  Object.assign(event, { gamepad })
  window.dispatchEvent(event)
}

describe('useGamepad', () => {
  let rafCallback: FrameRequestCallback | null

  beforeEach(() => {
    rafCallback = null
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      rafCallback = cb
      return 1
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function triggerRaf() {
    const cb = rafCallback
    rafCallback = null
    cb?.(16)
  }

  it('keeps updating the remaining gamepad after another one disconnects', async () => {
    const pad0 = createGamepad(0)
    const pad1 = createGamepad(1)
    let connectedPads: MockGamepad[] = [pad0, pad1]
    const navigator = { getGamepads: () => connectedPads } as unknown as Navigator

    const { gamepads } = useGamepad({ navigator })
    await nextTick()

    dispatchGamepadEvent('gamepadconnected', pad0)
    dispatchGamepadEvent('gamepadconnected', pad1)
    await nextTick()

    expect(gamepads.value.map(g => g.index)).toEqual([0, 1])

    // pad0 disconnects, so pad1 is re-packed to array position 0
    dispatchGamepadEvent('gamepaddisconnected', pad0)
    connectedPads = [pad1]
    await nextTick()

    expect(gamepads.value.map(g => g.index)).toEqual([1])

    // pad1 reports new input on the next frame
    pad1.timestamp = 1000
    pad1.axes = [0.5, 0, 0, 0]
    pad1.buttons = [{ pressed: true, touched: true, value: 1 }]

    triggerRaf()
    await nextTick()

    const survivor = gamepads.value.find(g => g.index === 1)!
    expect(survivor.timestamp).toBe(1000)
    expect(survivor.buttons[0].pressed).toBe(true)
  })

  it('skips null slots returned by getGamepads', async () => {
    const pad = createGamepad(1)
    // browsers return a fixed-length array with null in the unused slots
    const connectedPads: Array<MockGamepad | null> = [null, pad]
    const navigator = { getGamepads: () => connectedPads } as unknown as Navigator

    const { gamepads } = useGamepad({ navigator })
    await nextTick()

    dispatchGamepadEvent('gamepadconnected', pad)
    await nextTick()

    expect(gamepads.value.map(g => g.index)).toEqual([1])

    // new input arrives on the next frame, alongside a null slot
    pad.timestamp = 1000
    pad.buttons = [{ pressed: true, touched: true, value: 1 }]

    expect(() => triggerRaf()).not.toThrow()
    await nextTick()

    const updated = gamepads.value.find(g => g.index === 1)!
    expect(updated.timestamp).toBe(1000)
    expect(updated.buttons[0].pressed).toBe(true)
  })
})
