import { ref } from 'vue-demi'
import { type Fn, tryOnScopeDispose } from '@vueuse/shared'
import { type ConfigurableWindow, defaultWindow } from '../_configurable'

/**
 * Reactively track `window.devicePixelRatio`.
 *
 * @see https://vueuse.org/useDevicePixelRatio
 * @param options
 */
export function useDevicePixelRatio({
  window = defaultWindow,
}: ConfigurableWindow = {}) {
  if (!window) {
    return {
      pixelRatio: ref(1),
    }
  }

  const pixelRatio = ref(1)

  let mqResolution: MediaQueryList
  tryOnScopeDispose((function MqResolutionObserve(): Fn {
    pixelRatio.value = window.devicePixelRatio
    mqResolution = window.matchMedia(`(resolution: ${pixelRatio.value}dppx)`)
    mqResolution.addEventListener('change', MqResolutionObserve, { once: true })
    return () => {
      mqResolution.removeEventListener('change', MqResolutionObserve)
    }
  })())

  return { pixelRatio }
}

export type UseDevicePixelRatioReturn = ReturnType<typeof useDevicePixelRatio>
