/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

/**
 * Reactive DeviceOrientationEvent.
 *
 * @see https://vueuse.org/useDeviceOrientation
 * @param options
 */
export function useDeviceOrientation(options: ConfigurableWindow = {}) {
  const { window = defaultWindow } = options
  const isSupported = useSupported(() => window && 'DeviceOrientationEvent' in window)

  const isAbsolute = ref(false)
  const alpha: Ref<number | null> = ref(null)
  const beta: Ref<number | null> = ref(null)
  const gamma: Ref<number | null> = ref(null)

  if (window && isSupported.value) {
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

export type UseDeviceOrientationReturn = ReturnType<typeof useDeviceOrientation>
