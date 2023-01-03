import { computedWithControl } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import type { ConfigurableDocumentOrShadowRoot, ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface UseActiveElementOptions extends ConfigurableWindow, ConfigurableDocumentOrShadowRoot {}

/**
 * Reactive `document.activeElement`
 *
 * @see https://vueuse.org/useActiveElement
 * @param options
 */
export function useActiveElement<T extends HTMLElement>(options: UseActiveElementOptions = {}) {
  const { window = defaultWindow } = options
  const document = options.document ?? window?.document
  const activeElement = computedWithControl(
    () => null,
    () => document?.activeElement as T | null | undefined,
  )

  if (window) {
    useEventListener(window, 'blur', (event) => {
      if (event.relatedTarget !== null)
        return

      activeElement.trigger()
    }, true)
    useEventListener(window, 'focus', activeElement.trigger, true)
  }

  return activeElement
}
