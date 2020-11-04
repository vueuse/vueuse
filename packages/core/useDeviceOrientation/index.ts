/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { isClient } from '@vueuse/shared'
import { ref, Ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'

export function useDeviceOrientation(target: Window | null = isClient ? window : null) {
  const eventTarget = isClient ? target : null
  const isAbsolute = ref(false)
  const alpha: Ref<number | null> = ref(0)
  const beta: Ref<number | null> = ref(0)
  const gamma: Ref<number | null> = ref(0)

  if (eventTarget) {
    useEventListener('deviceorientation', (event: any) => {
      isAbsolute.value = event.absolute
      alpha.value = event.alpha
      beta.value = event.beta
      gamma.value = event.gamma
    }, false, eventTarget)
  }

  return {
    isAbsolute,
    alpha,
    beta,
    gamma,
  }
}
