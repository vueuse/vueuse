/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, Ref } from '../api'
import { useEventListener } from '../useEventListener'

export function useDeviceLight () {
  const light: Ref<number | null> = ref(null)

  useEventListener('devicelight', (event) => {
    light.value = event.value
  })

  return light
}
