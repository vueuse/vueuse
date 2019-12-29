/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { onMounted, onUnmounted, ref, Ref } from '../api'

export function useDeviceLight () {
  const light: Ref<number | null> = ref(null)
  function handler (event: DeviceLightEvent) {
    light.value = event.value
  }

  onMounted(() => {
    window.addEventListener('devicelight', handler)
  })

  onUnmounted(() => {
    window.removeEventListener('devicelight', handler)
  })

  return {
    light,
  }
}
