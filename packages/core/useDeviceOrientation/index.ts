/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, Ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export function useDeviceOrientation(options: ConfigurableWindow = {}) {
  const {
    window = defaultWindow,
  } = options

  const isAbsolute = ref(false)
  const alpha: Ref<number | null> = ref(0)
  const beta: Ref<number | null> = ref(0)
  const gamma: Ref<number | null> = ref(0)

  if (window) {
    useEventListener('deviceorientation', (event) => {
      isAbsolute.value = event.absolute
      alpha.value = event.alpha
      beta.value = event.beta
      gamma.value = event.gamma
    }, undefined, window)
  }

  return {
    isAbsolute,
    alpha,
    beta,
    gamma,
  }
}
