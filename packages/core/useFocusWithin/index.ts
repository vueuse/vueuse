import type { ComputedRef } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeElementRef } from '../unrefElement'
import { computed, ref } from 'vue'
import { defaultWindow } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useActiveElement } from '../useActiveElement'
import { useEventListener } from '../useEventListener'

export interface UseFocusWithinReturn {
  /**
   * True if the element or any of its descendants are focused
   */
  focused: ComputedRef<boolean>
}

const EVENT_FOCUS_IN = 'focusin'
const EVENT_FOCUS_OUT = 'focusout'
const PSEUDO_CLASS_FOCUS_WITHIN = ':focus-within'

/**
 * Track if focus is contained within the target element
 *
 * @see https://vueuse.org/useFocusWithin
 * @param target The target element to track
 * @param options Focus within options
 */
export function useFocusWithin(target: MaybeElementRef, options: ConfigurableWindow = {}): UseFocusWithinReturn {
  const { window = defaultWindow } = options
  const targetElement = computed(() => unrefElement(target))
  const _focused = ref(false)
  const focused = computed(() => _focused.value)
  const activeElement = useActiveElement(options)

  if (!window || !activeElement.value) {
    return { focused }
  }

  const listenerOptions = { passive: true }
  useEventListener(targetElement, EVENT_FOCUS_IN, () => _focused.value = true, listenerOptions)
  useEventListener(targetElement, EVENT_FOCUS_OUT, () =>
    _focused.value = targetElement.value?.matches?.(PSEUDO_CLASS_FOCUS_WITHIN) ?? false, listenerOptions)

  return { focused }
}
