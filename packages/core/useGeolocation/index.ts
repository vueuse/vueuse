/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { Ref } from 'vue-demi'
import { ref, shallowRef } from 'vue-demi'
import { tryOnScopeDispose } from '@vueuse/shared'
import type { ConfigurableNavigator } from '../_configurable'
import { defaultNavigator } from '../_configurable'
import { useSupported } from '../useSupported'

export interface UseGeolocationOptions extends Partial<PositionOptions>, ConfigurableNavigator {
  immediate?: boolean
}

/**
 * Reactive Geolocation API.
 *
 * @see https://vueuse.org/useGeolocation
 * @param options
 */
export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    maximumAge = 30000,
    timeout = 27000,
    navigator = defaultNavigator,
    immediate = true,
  } = options

  const isSupported = useSupported(() => navigator && 'geolocation' in navigator)

  const locatedAt: Ref<number | null> = ref(null)
  const error = shallowRef<GeolocationPositionError | null>(null)
  const coords: Ref<GeolocationPosition['coords']> = ref({
    accuracy: 0,
    latitude: Infinity,
    longitude: Infinity,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  })

  function updatePosition(position: GeolocationPosition) {
    locatedAt.value = position.timestamp
    coords.value = position.coords
    error.value = null
  }

  let watcher: number

  function resume() {
    if (isSupported.value) {
      watcher = navigator!.geolocation.watchPosition(
        updatePosition,
        err => error.value = err,
        {
          enableHighAccuracy,
          maximumAge,
          timeout,
        },
      )
    }
  }

  if (immediate)
    resume()

  function pause() {
    if (watcher && navigator)
      navigator.geolocation.clearWatch(watcher)
  }

  tryOnScopeDispose(() => {
    pause()
  })

  return {
    isSupported,
    coords,
    locatedAt,
    error,
    resume,
    pause,
  }
}

export type UseGeolocationReturn = ReturnType<typeof useGeolocation>
