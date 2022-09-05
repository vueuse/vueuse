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
  const cleanups: Fn[] = []

  const cleanup = () => {
    cleanups.map(i => i())
    cleanups.length = 0
  }

  const observe = () => {
    pixelRatio.value = window.devicePixelRatio
    cleanup()
    mqResolution = window.matchMedia(`(resolution: ${pixelRatio.value}dppx)`)
    mqResolution.addEventListener('change', observe, { once: true })
    cleanups.push(() => {
      mqResolution.removeEventListener('change', observe)
    })
  }

  observe()
  tryOnScopeDispose(cleanup)

  return { pixelRatio }
}

export type UseDevicePixelRatioReturn = ReturnType<typeof useDevicePixelRatio>
