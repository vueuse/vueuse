import { computed, Ref } from 'vue-demi'
import { MaybeElementRef, unrefElement } from '../unrefElement'
import { useActiveElement } from '../useActiveElement'
import { ConfigurableWindow } from '../_configurable'

export interface FocusWithinOptions extends ConfigurableWindow {
  /**
   * The target element to track
   */
  target: MaybeElementRef
}

export interface FocusWithinReturn {
  /**
   * True if the element or any of its descendants are focused
   */
  focused: Ref<boolean>
}

/**
 * Track if focus is contained within the target element
 *
 * @see https://vueuse.org/useFocusWithin
 * @param options
 */
export function useFocusWithin(options: FocusWithinOptions): FocusWithinReturn {
  const activeElement = useActiveElement(options)
  const target = computed(() => unrefElement(options.target))
  const focused = computed(() => target.value && activeElement.value ? target.value.contains(activeElement.value) : false)

  return { focused }
}
