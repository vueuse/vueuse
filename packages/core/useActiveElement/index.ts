import type { ConfigurableDocumentOrShadowRoot, ConfigurableWindow } from '../_configurable'
import { ref } from 'vue-demi'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { useMutationObserver } from '../useMutationObserver'

export interface UseActiveElementOptions extends ConfigurableWindow, ConfigurableDocumentOrShadowRoot {
  /**
   * Search active element deeply inside shadow dom
   *
   * @default true
   */
  deep?: boolean
  /**
   * Track active element when it's removed from the DOM
   * Using a MutationObserver under the hood
   * @default false
   */
  triggerOnRemoval?: boolean
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
    deep = true,
    triggerOnRemoval = false,
  } = options
  const document = options.document ?? window?.document

  const getDeepActiveElement = () => {
    let element = document?.activeElement
    if (deep) {
      while (element?.shadowRoot)
        element = element?.shadowRoot?.activeElement
    }
    return element
  }

  const activeElement = ref<T | null | undefined>()
  const trigger = () => {
    activeElement.value = getDeepActiveElement() as T | null | undefined
  }

  if (window) {
    useEventListener(window, 'blur', (event) => {
      if (event.relatedTarget !== null)
        return
      trigger()
    }, true)
    useEventListener(window, 'focus', trigger, true)
  }

  if (triggerOnRemoval) {
    useMutationObserver(document as any, (mutations) => {
      mutations.filter(m => m.removedNodes.length)
        .map(n => Array.from(n.removedNodes))
        .flat()
        .forEach((node) => {
          if (node === activeElement.value)
            trigger()
        })
    }, {
      childList: true,
      subtree: true,
    })
  }

  trigger()

  return activeElement
}
