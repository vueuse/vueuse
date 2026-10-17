/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { ShallowRef } from 'vue'
import type { ConfigurableNavigator } from '../_configurable'
import type { Supportable } from '../types'
import { shallowReadonly, shallowRef } from 'vue'
import { defaultNavigator } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'

/**
 * Many of the jsdoc definitions here are modified version of the
 * documentation from MDN(https://developer.mozilla.org/en-US/docs/Web/API/BatteryManager/charging)
 */

export interface UseBatteryOptions extends ConfigurableNavigator {
}

export interface UseBatteryReturn extends Supportable {
  /**
   * A Boolean value indicating whether the battery is currently being charged.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/BatteryManager/charging)
   */
  charging: Readonly<ShallowRef<boolean>>
  /**
   * A number representing the remaining time in seconds until the battery is fully charged, or 0 if the battery is already fully charged.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/BatteryManager/chargingTime)
   */
  chargingTime: Readonly<ShallowRef<number>>
  /**
   * A number representing the remaining time in seconds until the battery is completely discharged and the system suspends.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/BatteryManager/dischargingTime)
   */
  dischargingTime: Readonly<ShallowRef<number>>
  /**
   * A number representing the system's battery charge level scaled to a value between 0.0 and 1.0.
   *
   * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/BatteryManager/level)
   */
  level: Readonly<ShallowRef<number>>
}

export interface BatteryManager extends EventTarget {
  readonly charging: boolean
  readonly chargingTime: number
  readonly dischargingTime: number
  readonly level: number
}

type NavigatorWithBattery = Navigator & {
  getBattery: () => Promise<BatteryManager>
}

/**
 * Reactive Battery Status API.
 *
 * @see https://vueuse.org/useBattery
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useBattery(options: UseBatteryOptions = {}): UseBatteryReturn {
  const { navigator = defaultNavigator } = options
  const events = ['chargingchange', 'chargingtimechange', 'dischargingtimechange', 'levelchange']

  const isSupported = useSupported(() => navigator && 'getBattery' in navigator && typeof navigator.getBattery === 'function')

  const charging = shallowRef(false)
  const chargingTime = shallowRef(0)
  const dischargingTime = shallowRef(0)
  const level = shallowRef(1)

  let battery: BatteryManager | null

  function updateBatteryInfo(this: BatteryManager) {
    charging.value = this.charging
    chargingTime.value = this.chargingTime || 0
    dischargingTime.value = this.dischargingTime || 0
    level.value = this.level
  }

  if (isSupported.value) {
    (navigator as NavigatorWithBattery)
      .getBattery()
      .then((_battery) => {
        battery = _battery
        updateBatteryInfo.call(battery)
        useEventListener(battery, events, updateBatteryInfo, { passive: true })
      })
  }

  return {
    isSupported,
    charging: shallowReadonly(charging),
    chargingTime: shallowReadonly(chargingTime),
    dischargingTime: shallowReadonly(dischargingTime),
    level: shallowReadonly(level),
  }
}
