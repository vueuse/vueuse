import { ref } from 'vue-demi'
import { tryOnScopeDispose } from '@vueuse/shared'
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
  const pixelRatio = ref(1)

  if (window) {
    let media: MediaQueryList
    function observe() {
      pixelRatio.value = window!.devicePixelRatio
      cleanup()
      media = window!.matchMedia(`(resolution: ${pixelRatio.value}dppx)`)
      media.addEventListener('change', observe, { once: true })
    }
    function cleanup() {
      media?.removeEventListener('change', observe)
    }

    observe()
    tryOnScopeDispose(cleanup)
  }

  return { pixelRatio }
}

export type UseDevicePixelRatioReturn = ReturnType<typeof useDevicePixelRatio>
