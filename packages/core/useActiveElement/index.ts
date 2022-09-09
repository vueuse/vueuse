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
  const [activeElement, update] = computedWithControl(
    () => null,
    () => window?.document.activeElement as T | null | undefined,
    true,
  )

  if (window) {
    useEventListener(window, 'blur', update, true)
    useEventListener(window, 'focus', update, true)
  }

  return activeElement
}
