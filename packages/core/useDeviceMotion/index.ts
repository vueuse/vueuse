/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { ConfigurableEventFilter } from '@vueuse/shared'
import type { Ref } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { bypassFilter, createFilterWrapper } from '@vueuse/shared'
import { ref } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'

export interface DeviceMotionOptions extends ConfigurableWindow, ConfigurableEventFilter {
  /**
   * Request for permissions immediately if it's not granted,
   * otherwise label and deviceIds could be empty
   *
   * @default false
   */
  requestPermissions?: boolean
}

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
    requestPermissions = false,
    eventFilter = bypassFilter,
  } = options

  const isSupported = useSupported(() => typeof DeviceMotionEvent !== 'undefined')
  const requirePermissions = useSupported(() => isSupported.value && 'requestPermission' in DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function')
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
          acceleration.value = {
            x: event.acceleration?.x || null,
            y: event.acceleration?.y || null,
            z: event.acceleration?.z || null,
          }
          accelerationIncludingGravity.value = {
            x: event.accelerationIncludingGravity?.x || null,
            y: event.accelerationIncludingGravity?.y || null,
            z: event.accelerationIncludingGravity?.z || null,
          }
          rotationRate.value = {
            alpha: event.rotationRate?.alpha || null,
            beta: event.rotationRate?.beta || null,
            gamma: event.rotationRate?.gamma || null,
          }
          interval.value = event.interval
        },
      )

      useEventListener(window, 'devicemotion', onDeviceMotion, { passive: true })
    }
  }

  const ensurePermissions = async () => {
    if (!requirePermissions.value)
      permissionGranted.value = true

    if (permissionGranted.value)
      return
    if (requirePermissions.value) {
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

  if (isSupported.value) {
    if (requestPermissions && requirePermissions.value) {
      ensurePermissions()
        .then(() => init())
    }
    else {
      init()
    }
  }

  return {
    acceleration,
    accelerationIncludingGravity,
    rotationRate,
    interval,
    isSupported,
    requirePermissions,
    ensurePermissions,
    permissionGranted,
  }
}

export type UseDeviceMotionReturn = ReturnType<typeof useDeviceMotion>
