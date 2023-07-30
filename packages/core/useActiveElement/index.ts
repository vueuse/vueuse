import { computedWithControl } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import type { ConfigurableDocumentOrShadowRoot, ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface UseActiveElementOptions extends ConfigurableWindow, ConfigurableDocumentOrShadowRoot {
  /**
   * Search actively deeply in shadow dom
   *
   * @default true
   */
  deepActiveElement?: boolean
}

/**
 * Reactive `document.activeElement`
 *
 * @see https://vueuse.org/useActiveElement
 * @param options
 */
export function useActiveElement<T extends HTMLElement>(
  options: UseActiveElementOptions = {},
) {
  const {
    window = defaultWindow,
    deepActiveElement = true,
  } = options
  const document = options.document ?? window?.document

  const getDeepActiveElement = () => {
    let element = document?.activeElement
    if (deepActiveElement) {
      while (element?.shadowRoot)
        element = element?.shadowRoot?.activeElement
    }
    return element
  }

  const activeElement = computedWithControl(
    () => null,
    () => getDeepActiveElement() as T | null | undefined,
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
