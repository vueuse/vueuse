import type { ConfigurableWindow } from '../_configurable'
import type { UseScrollOptions, UseScrollReturn } from '../useScroll'
import { defaultWindow } from '../_configurable'
import { useScroll } from '../useScroll'

export interface UseWindowScrollOptions extends ConfigurableWindow, UseScrollOptions {
}

export interface UseWindowScrollReturn extends UseScrollReturn {
}

/**
 * Reactive window scroll.
 *
 * @see https://vueuse.org/useWindowScroll
 * @param options
 */
export function useWindowScroll(options: UseWindowScrollOptions = {}): UseWindowScrollReturn {
  const { window = defaultWindow, ...rest } = options
  return useScroll(window, rest)
}
