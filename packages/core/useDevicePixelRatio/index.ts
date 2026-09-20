import type { ShallowRef, WatchStopHandle } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { noop, watchImmediate } from '@vueuse/shared'
import { shallowReadonly, shallowRef } from 'vue'
import { defaultWindow } from '../_configurable'
import { useMediaQuery } from '../useMediaQuery'

export interface UseDevicePixelRatioOptions extends ConfigurableWindow {
}

export interface UseDevicePixelRatioReturn {
  pixelRatio: Readonly<ShallowRef<number>>
  stop: WatchStopHandle
}

/**
 * Reactively track `window.devicePixelRatio`.
 *
 * @see https://vueuse.org/useDevicePixelRatio
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useDevicePixelRatio(options: UseDevicePixelRatioOptions = {}): UseDevicePixelRatioReturn {
  const {
    window = defaultWindow,
  } = options

  const pixelRatio = shallowRef(1)
  const query = useMediaQuery(() => `(resolution: ${pixelRatio.value}dppx)`, options)
  let stop: WatchStopHandle = noop

  if (window) {
    stop = watchImmediate(query, () => pixelRatio.value = window!.devicePixelRatio)
  }

  return {
    pixelRatio: shallowReadonly(pixelRatio),
    stop,
  }
}
