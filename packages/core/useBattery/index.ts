/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { ConfigurableNavigator } from '../_configurable'
import { shallowRef } from 'vue'
import { defaultNavigator } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'

export interface BatteryManager extends EventTarget {
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
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
export function useBattery(options: ConfigurableNavigator = {}) {
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
    charging,
    chargingTime,
    dischargingTime,
    level,
  }
}

export type UseBatteryReturn = ReturnType<typeof useBattery>
