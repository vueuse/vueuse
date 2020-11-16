/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, Ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

/**
 * Reactive DeviceOrientationEvent
 *
 * @see   {@link https://vueuse.js.org/useDeviceOrientation}
 * @param options
 */
export function useDeviceOrientation({ window = defaultWindow }: ConfigurableWindow = {}) {
  const isSupported = window && 'DeviceOrientationEvent' in window

  const isAbsolute = ref(false)
  const alpha: Ref<number | null> = ref(0)
  const beta: Ref<number | null> = ref(0)
  const gamma: Ref<number | null> = ref(0)

  if (window && isSupported) {
    useEventListener(window, 'deviceorientation', (event) => {
      isAbsolute.value = event.absolute
      alpha.value = event.alpha
      beta.value = event.beta
      gamma.value = event.gamma
    })
  }

  return {
    isSupported,
    isAbsolute,
    alpha,
    beta,
    gamma,
  }
}
