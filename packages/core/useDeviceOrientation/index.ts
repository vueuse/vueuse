/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { Ref, ShallowRef } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { Supportable } from '../types'
import { shallowRef } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'

export interface UseDeviceOrientationOptions extends ConfigurableWindow {
}

export interface UseDeviceOrientationReturn extends Supportable {
  isAbsolute: ShallowRef<boolean, boolean>
  alpha: Ref<number | null, number | null>
  beta: Ref<number | null, number | null>
  gamma: Ref<number | null, number | null>
}

/**
 * Reactive DeviceOrientationEvent.
 *
 * @see https://vueuse.org/useDeviceOrientation
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useDeviceOrientation(options: UseDeviceOrientationOptions = {}) {
  const { window = defaultWindow } = options
  const isSupported = useSupported(() => window && 'DeviceOrientationEvent' in window)

  const isAbsolute = shallowRef(false)
  const alpha: Ref<number | null> = shallowRef(null)
  const beta: Ref<number | null> = shallowRef(null)
  const gamma: Ref<number | null> = shallowRef(null)

  if (window && isSupported.value) {
    useEventListener(window, 'deviceorientation', (event) => {
      isAbsolute.value = event.absolute
      alpha.value = event.alpha
      beta.value = event.beta
      gamma.value = event.gamma
    }, { passive: true })
  }

  return {
    isSupported,
    isAbsolute,
    alpha,
    beta,
    gamma,
  }
}
