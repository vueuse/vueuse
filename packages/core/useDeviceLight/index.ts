/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, Ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export function useDeviceLight({ window = defaultWindow }: ConfigurableWindow = {}) {
  const light: Ref<number | null> = ref(null)

  if (window) {
    useEventListener(window, 'devicelight', (event) => {
      light.value = event.value
    })
  }

  return light
}
