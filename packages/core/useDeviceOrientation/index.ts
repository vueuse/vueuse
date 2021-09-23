/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, Ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

/**
 * Reactive DeviceOrientationEvent.
 *
 * @see https://vueuse.org/useDeviceOrientation
 * @param options
 */
export function useDeviceOrientation(options: ConfigurableWindow = {}) {
  const { window = defaultWindow } = options

  const isSupported = Boolean(window && 'DeviceOrientationEvent' in window)

  const isAbsolute = ref(false)
  const alpha: Ref<number | null> = ref(null)
  const beta: Ref<number | null> = ref(null)
  const gamma: Ref<number | null> = ref(null)
  const webkitCompassHeading: Ref<number | null> = ref(null)
  const webkitCompassAccuracy: Ref<number | null> = ref(null)

  if (window && isSupported) {
    useEventListener(window, 'deviceorientation', (event) => {
      isAbsolute.value = event.absolute
      alpha.value = event.alpha
      beta.value = event.beta
      gamma.value = event.gamma

      if (event.webkitCompassHeading) {
        webkitCompassHeading.value = event.webkitCompassHeading
      }

      if (event.webkitCompassAccuracy) {
        webkitCompassAccuracy.value = event.webkitCompassAccuracy
      }
    })
  }

  return {
    isSupported,
    isAbsolute,
    alpha,
    beta,
    gamma,
    webkitCompassHeading,
    webkitCompassAccuracy
  }
}

export type UseDeviceOrientationReturn = ReturnType<typeof useDeviceOrientation>
