import type { MaybeRef } from '@vueuse/shared'
import { computedWithControl } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface UseActiveElementOptions extends ConfigurableWindow {
  ignoreBody?: MaybeRef<boolean>
}

/**
 * Reactive `document.activeElement`
 *
 * @see https://vueuse.org/useActiveElement
 * @param options
 */
export function useActiveElement<T extends HTMLElement>(options: UseActiveElementOptions = {}) {
  const { window = defaultWindow, ignoreBody } = options
  const activeElement = computedWithControl(
    () => null,
    () => window?.document.activeElement as T | null | undefined,
  )

  if (window) {
    useEventListener(window, 'blur', (event) => {
      if (event.relatedTarget === null)
        return

      if (ignoreBody && window?.document.activeElement?.tagName === 'BODY')
        return

      activeElement.trigger()
    }, true)
    useEventListener(window, 'focus', () => {
      if (ignoreBody && window?.document.activeElement?.tagName === 'BODY')
        return

      activeElement.trigger()
    }, true)
  }

  return activeElement
}
