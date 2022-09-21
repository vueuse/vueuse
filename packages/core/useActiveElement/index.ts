import { computedWithControl } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

/**
 * Reactive `document.activeElement`
 *
 * @see https://vueuse.org/useActiveElement
 * @param options
 */
export function useActiveElement<T extends HTMLElement>(options: ConfigurableWindow = {}) {
  const { window = defaultWindow } = options
  const activeElement = computedWithControl(
    () => null,
    () => window?.document.activeElement as T | null | undefined,
  )

  if (window) {
    useEventListener(window, 'blur', activeElement.trigger, true)
    useEventListener(window, 'focus', activeElement.trigger, true)
  }

  return activeElement
}
