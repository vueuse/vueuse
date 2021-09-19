import { computed } from 'vue-demi'
import { unrefElement } from '../unrefElement'
import { useFocus, FocusOptions, FocusReturn } from '../useFocus'

/**
 * Utility to track or set the focus state of a Form Input element.
 *
 * @see https://vueuse.org/useFocusInputElement
 * @param options
 */
export function useFocusInputElement(options: FocusOptions = {}): FocusReturn {
  const input = computed<HTMLElement | null>(() => unrefElement(options.target)?.querySelector('input,select,textarea') as HTMLElement)
  return useFocus({ ...options, target: input })
}
