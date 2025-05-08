import type { Ref } from 'vue'
import type { ConfigurableNavigator, ConfigurableWindow } from '../_configurable'
import { createEventHook, tryOnMounted } from '@vueuse/shared'
import { computed, ref as deepRef } from 'vue'
import { defaultNavigator } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { useRafFn } from '../useRafFn'
import { useSupported } from '../useSupported'

export interface UseGamepadOptions extends ConfigurableWindow, ConfigurableNavigator {

}

/**
 * Maps a [standard gamepad](https://w3c.github.io/gamepad/#remapping) to an Xbox 360 Controller.
 * https://support.xbox.com/en-US/help/xbox-360/accessories/controllers
 */
export function mapGamepadToXbox360Controller(gamepad: Ref<Gamepad | undefined>) {
  return computed(() => {
    if (gamepad.value) {
      return {
        ...mapGamepadToStandardController(gamepad.value),
        buttons: {
          a: gamepad.value.buttons[0],
          b: gamepad.value.buttons[1],
          x: gamepad.value.buttons[2],
          y: gamepad.value.buttons[3],
        },
        back: gamepad.value.buttons[8],
        start: gamepad.value.buttons[9],
      }
    }

    return null
  })
}

/**
 * Maps a [standard gamepad](https://w3c.github.io/gamepad/#remapping) to a PS5 DualSense Controller.
 *
 * You can find more about PS5 DualSense controller's original part names at
 * https://controller.dl.playstation.net/controller/lang/en/DS_partnames.html.
 */
export function mapGamepadToPS5DualSenseController(gamepad: Ref<Gamepad | undefined>) {
  return computed(() => {
    if (gamepad.value) {
      return {
        ...mapGamepadToStandardController(gamepad.value),
        buttons: {
          '⨯': gamepad.value.buttons[0],
          '○': gamepad.value.buttons[1],
          '□': gamepad.value.buttons[2],
          '△': gamepad.value.buttons[3],
          'L1': gamepad.value.buttons[4],
          'R1': gamepad.value.buttons[5],
          'L2': gamepad.value.buttons[6],
          'R2': gamepad.value.buttons[7],
        },
        create: gamepad.value.buttons[8],
        options: gamepad.value.buttons[9],
      }
    }
    return null
  })
}

/**
 * Shared name mapping across different controllers
 */
function mapGamepadToStandardController(gamepad: Gamepad) {
  return {
    bumper: {
      left: gamepad.buttons[4],
      right: gamepad.buttons[5],
    },
    triggers: {
      left: gamepad.buttons[6],
      right: gamepad.buttons[7],
    },
    stick: {
      left: {
        horizontal: gamepad.axes[0],
        vertical: gamepad.axes[1],
        button: gamepad.buttons[10],
      },
      right: {
        horizontal: gamepad.axes[2],
        vertical: gamepad.axes[3],
        button: gamepad.buttons[11],
      },
    },
    dpad: {
      up: gamepad.buttons[12],
      down: gamepad.buttons[13],
      left: gamepad.buttons[14],
      right: gamepad.buttons[15],
    },
  }
}

export function useGamepad(options: UseGamepadOptions = {}) {
  const {
    navigator = defaultNavigator,
  } = options
  const isSupported = useSupported(() => navigator && 'getGamepads' in navigator)
  const gamepads = deepRef<Gamepad[]>([])

  const onConnectedHook = createEventHook<number>()
  const onDisconnectedHook = createEventHook<number>()

  const stateFromGamepad = (gamepad: Gamepad) => {
    const hapticActuators = []
    const vibrationActuator = 'vibrationActuator' in gamepad ? (gamepad as any).vibrationActuator : null

    if (vibrationActuator)
      hapticActuators.push(vibrationActuator)

    // @ts-expect-error missing in types
    if (gamepad.hapticActuators)
      // @ts-expect-error missing in types
      hapticActuators.push(...gamepad.hapticActuators)

    return {
      id: gamepad.id,
      index: gamepad.index,
      connected: gamepad.connected,
      mapping: gamepad.mapping,
      timestamp: gamepad.timestamp,
      vibrationActuator: gamepad.vibrationActuator,
      hapticActuators,
      axes: gamepad.axes.map(axes => axes),
      buttons: gamepad.buttons.map(button => ({ pressed: button.pressed, touched: button.touched, value: button.value })),
    } as Gamepad
  }

  const updateGamepadState = () => {
    const _gamepads = navigator?.getGamepads() || []

    for (const gamepad of _gamepads) {
      if (gamepad && gamepads.value[gamepad.index])
        gamepads.value[gamepad.index] = stateFromGamepad(gamepad)
    }
  }

  const { isActive, pause, resume } = useRafFn(updateGamepadState)

  const onGamepadConnected = (gamepad: Gamepad) => {
    if (!gamepads.value.some(({ index }) => index === gamepad.index)) {
      gamepads.value.push(stateFromGamepad(gamepad))
      onConnectedHook.trigger(gamepad.index)
    }

    resume()
  }

  const onGamepadDisconnected = (gamepad: Gamepad) => {
    gamepads.value = gamepads.value.filter(x => x.index !== gamepad.index)
    onDisconnectedHook.trigger(gamepad.index)
  }

  const listenerOptions = { passive: true }
  useEventListener('gamepadconnected', e => onGamepadConnected(e.gamepad), listenerOptions)
  useEventListener('gamepaddisconnected', e => onGamepadDisconnected(e.gamepad), listenerOptions)

  tryOnMounted(() => {
    const _gamepads = navigator?.getGamepads() || []

    for (const gamepad of _gamepads) {
      if (gamepad && gamepads.value[gamepad.index])
        onGamepadConnected(gamepad)
    }
  })

  pause()

  return {
    isSupported,
    onConnected: onConnectedHook.on,
    onDisconnected: onDisconnectedHook.on,
    gamepads,
    pause,
    resume,
    isActive,
  }
}

export type UseGamepadReturn = ReturnType<typeof useGamepad>
