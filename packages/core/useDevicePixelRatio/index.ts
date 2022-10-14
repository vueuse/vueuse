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
  if (!window) {
    return {
      pixelRatio: ref(1),
    }
  }

  const pixelRatio = ref(1)

  let media: MediaQueryList
  const observe = () => {
    pixelRatio.value = window.devicePixelRatio
    media = window.matchMedia(`(resolution: ${pixelRatio.value}dppx)`)
    media.addEventListener('change', observe, { once: true })
  }

  observe()
  tryOnScopeDispose(() => {
    media.removeEventListener('change', observe)
  })

  return { pixelRatio }
}

export type UseDevicePixelRatioReturn = ReturnType<typeof useDevicePixelRatio>
