import type { ConfigurableWindow } from '../_configurable'
import type { UseScrollOptions } from '../useScroll'
import { defaultWindow } from '../_configurable'
import { useScroll } from '../useScroll'

export interface UseWindowScrollOptions extends ConfigurableWindow, UseScrollOptions {
}

/**
 * Reactive window scroll.
 *
 * @see https://vueuse.org/useWindowScroll
 * @param options
 */
export function useWindowScroll(options: UseWindowScrollOptions = {}) {
  const { window = defaultWindow, ...rest } = options
  return useScroll(window, rest)
}

export type UseWindowScrollReturn = ReturnType<typeof useWindowScroll>
