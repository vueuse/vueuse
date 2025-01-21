import type { ConfigurableWindow } from '../_configurable'
import { noop, watchImmediate } from '@vueuse/shared'
import { readonly, ref } from 'vue'
import { defaultWindow } from '../_configurable'
import { useMediaQuery } from '../useMediaQuery'

/**
 * Reactively track `window.devicePixelRatio`.
 *
 * @see https://vueuse.org/useDevicePixelRatio
 */
export function useDevicePixelRatio(options: ConfigurableWindow = {}) {
  const {
    window = defaultWindow,
  } = options

  const pixelRatio = ref(1)
  const query = useMediaQuery(() => `(resolution: ${pixelRatio.value}dppx)`, options)
  let stop = noop

  if (window) {
    stop = watchImmediate(query, () => pixelRatio.value = window!.devicePixelRatio)
  }

  return {
    pixelRatio: readonly(pixelRatio),
    stop,
  }
}

export type UseDevicePixelRatioReturn = ReturnType<typeof useDevicePixelRatio>
