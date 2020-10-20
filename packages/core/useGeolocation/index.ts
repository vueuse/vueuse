/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, Ref } from 'vue-demi'
import { tryOnMounted, tryOnUnmounted } from '@vueuse/shared'

export function useGeolocation(options: PositionOptions = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
}) {
  const locatedAt: Ref<number | null> = ref(null)
  const error = ref<PositionError | null>(null)
  const coords: Ref<Position['coords']> = ref({
    accuracy: 0,
    latitude: 0,
    longitude: 0,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  })

  function updatePosition(position: Position) {
    locatedAt.value = position.timestamp
    coords.value = position.coords
    error.value = null
  }

  let watcher: number

  tryOnMounted(() => {
    if ('geolocation' in navigator) {
      watcher = window.navigator.geolocation.watchPosition(
        updatePosition,
        (err) => {
          error.value = err
        },
        options,
      )
    }
  })

  tryOnUnmounted(() => {
    if (watcher)
      window.navigator.geolocation.clearWatch(watcher)
  })

  return {
    coords,
    locatedAt,
    error,
  }
}
