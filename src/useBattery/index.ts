/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, onMounted, onUnmounted } from '../api'

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

export function useBattery () {
  const charging = ref(false)
  const chargingTime = ref(0)
  const dischargingTime = ref(0)
  const level = ref(1)

  function updateBatteryInfo (this: BatteryManager) {
    charging.value = this.charging
    chargingTime.value = this.chargingTime || 0
    dischargingTime.value = this.dischargingTime || 0
    level.value = this.level
  }

  onMounted(() => {
    if (!('getBattery' in navigator))
      return;

    (navigator as NavigatorWithBattery).getBattery().then((battery) => {
      updateBatteryInfo.call(battery)
      events.forEach((evt) => {
        battery.addEventListener(evt, updateBatteryInfo)
      })
    })
  })

  onUnmounted(() => {
    if (!('getBattery' in navigator))
      return;

    (navigator as NavigatorWithBattery).getBattery().then((battery) => {
      events.forEach((evt) => {
        battery.removeEventListener(evt, updateBatteryInfo)
      })
    })
  })

  return {
    charging,
    chargingTime,
    dischargingTime,
    level,
  }
}
