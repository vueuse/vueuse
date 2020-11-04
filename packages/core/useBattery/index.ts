/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'

export interface BatteryManager extends EventTarget {
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
}

type NavigatorWithBattery = Navigator & {
  getBattery: () => Promise<BatteryManager>
}

const events = ['chargingchange', 'chargingtimechange', 'dischargingtimechange', 'levelchange']

export function useBattery() {
  const charging = ref(false)
  const chargingTime = ref(0)
  const dischargingTime = ref(0)
  const level = ref(1)
  const supported = ref('getBattery' in navigator)
  let battery: BatteryManager | null

  function updateBatteryInfo(this: BatteryManager) {
    charging.value = this.charging
    chargingTime.value = this.chargingTime || 0
    dischargingTime.value = this.dischargingTime || 0
    level.value = this.level
  }

  if (supported.value) {
    (navigator as NavigatorWithBattery)
      .getBattery()
      .then((_battery) => {
        battery = _battery
        updateBatteryInfo.call(battery)
        for (const event of events)
          useEventListener(battery, event, updateBatteryInfo, undefined)
      })
  }

  return {
    charging,
    chargingTime,
    dischargingTime,
    level,
    supported,
  }
}
