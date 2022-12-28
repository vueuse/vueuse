import type { ComputedRef } from 'vue-demi'
import { computed } from 'vue-demi'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import type { UseActiveElementOptions } from '../useActiveElement'
import { useActiveElement } from '../useActiveElement'
export interface UseFocusWithinReturn {
  /**
   * True if the element or any of its descendants are focused
   */
  focused: ComputedRef<boolean>
}

/**
 * Track if focus is contained within the target element
 *
 * @see https://vueuse.org/useFocusWithin
 * @param target The target element to track
 * @param options Focus within options
 */

export function useFocusWithin(target: MaybeElementRef, options: UseActiveElementOptions = {}): UseFocusWithinReturn {
  const activeElement = useActiveElement(options)
  const targetElement = computed(() => unrefElement(target))
  const focused = computed(() => targetElement.value && activeElement.value ? targetElement.value.contains(activeElement.value) : false)

  return { focused }
}
