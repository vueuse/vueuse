/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { ConfigurableEventFilter } from '@vueuse/shared'
import { bypassFilter, createFilterWrapper } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface DeviceMotionOptions extends ConfigurableWindow, ConfigurableEventFilter { }
interface DeviceMotionEventiOS extends DeviceMotionOptions {
  requestPermission: () => Promise<'granted' | 'denied'>
}

/**
 * Reactive DeviceMotionEvent.
 *
 * @see https://vueuse.org/useDeviceMotion
 * @param options
 */
export function useDeviceMotion(options: DeviceMotionOptions = {}) {
  const {
    window = defaultWindow,
    eventFilter = bypassFilter,
  } = options

  const requirePermission = 'requestPermission' in DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function'
  const permissionGranted = ref(false)
  const acceleration: Ref<DeviceMotionEvent['acceleration']> = ref({ x: null, y: null, z: null })
  const rotationRate: Ref<DeviceMotionEvent['rotationRate']> = ref({ alpha: null, beta: null, gamma: null })
  const interval = ref(0)
  const accelerationIncludingGravity: Ref<DeviceMotionEvent['accelerationIncludingGravity']> = ref({
    x: null,
    y: null,
    z: null,
  })

  function init() {
    if (window) {
      const onDeviceMotion = createFilterWrapper(
        eventFilter,
        (event: DeviceMotionEvent) => {
          acceleration.value = { x: event.acceleration?.x || null, y: event.acceleration?.y || null, z: event.acceleration?.z || null }
          accelerationIncludingGravity.value = { x: event.accelerationIncludingGravity?.x || null, y: event.accelerationIncludingGravity?.y || null, z: event.accelerationIncludingGravity?.z || null }
          rotationRate.value = { alpha: event.rotationRate?.alpha || null, beta: event.rotationRate?.beta || null, gamma: event.rotationRate?.gamma || null }
          interval.value = event.interval
        },
      )

      useEventListener(window, 'devicemotion', onDeviceMotion)
    }
  }
  const trigger = async () => {
    if (requirePermission) {
      const requestPermission = (DeviceMotionEvent as unknown as DeviceMotionEventiOS).requestPermission
      try {
        const response = await requestPermission()
        if (response === 'granted') {
          permissionGranted.value = true
          init()
        }
      }
      catch (error) {
        console.error(error)
      }
    }
  }

  if (!requirePermission)
    init()

  return {
    acceleration,
    accelerationIncludingGravity,
    rotationRate,
    interval,
    requirePermission,
    permissionGranted,
    trigger,
  }
}

export type UseDeviceMotionReturn = ReturnType<typeof useDeviceMotion>
