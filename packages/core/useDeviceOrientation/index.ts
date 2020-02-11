/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, Ref } from '../../api'
import { useEventListener } from '../useEventListener'

export function useDeviceOrientation() {
  const isAbsolute = ref(false)
  const alpha: Ref<number | null> = ref(0)
  const beta: Ref<number | null> = ref(0)
  const gamma: Ref<number | null> = ref(0)

  useEventListener('deviceorientation', (event) => {
    isAbsolute.value = event.absolute
    alpha.value = event.alpha
    beta.value = event.beta
    gamma.value = event.gamma
  })

  return {
    isAbsolute,
    alpha,
    beta,
    gamma,
  }
}
