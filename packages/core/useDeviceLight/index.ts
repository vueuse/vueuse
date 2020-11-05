/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, Ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export function useDeviceLight(options: ConfigurableWindow = {}) {
  const {
    window = defaultWindow,
  } = options

  const light: Ref<number | null> = ref(null)

  if (window) {
    useEventListener('devicelight', (event) => {
      light.value = event.value
    }, undefined, window)
  }

  return light
}
