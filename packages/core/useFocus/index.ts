import type { Ref } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeElementRef } from '../unrefElement'
import { computed, ref, watch } from 'vue'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'

export interface UseFocusOptions extends ConfigurableWindow {
  /**
   * Initial value. If set true, then focus will be set on the target
   *
   * @default false
   */
  initialValue?: boolean

  /**
   * Replicate the :focus-visible behavior of CSS
   *
   * @default false
   */
  focusVisible?: boolean

  /**
   * Prevent scrolling to the element when it is focused.
   *
   * @default false
   */
  preventScroll?: boolean
}

export interface UseFocusReturn {
  /**
   * If read as true, then the element has focus. If read as false, then the element does not have focus
   * If set to true, then the element will be focused. If set to false, the element will be blurred.
   */
  focused: Ref<boolean>
}

/**
 * Track or set the focus state of a DOM element.
 *
 * @see https://vueuse.org/useFocus
 * @param target The target element for the focus and blur events.
 * @param options
 */
export function useFocus(target: MaybeElementRef, options: UseFocusOptions = {}): UseFocusReturn {
  const { initialValue = false, focusVisible = false, preventScroll = false } = options

  const innerFocused = ref(false)
  const targetElement = computed(() => unrefElement(target))

  const listenerOptions = { passive: true }
  useEventListener(targetElement, 'focus', (event) => {
    if (!focusVisible || (event.target as HTMLElement).matches?.(':focus-visible'))
      innerFocused.value = true
  }, listenerOptions)
  useEventListener(targetElement, 'blur', () => innerFocused.value = false, listenerOptions)

  const focused = computed({
    get: () => innerFocused.value,
    set(value: boolean) {
      if (!value && innerFocused.value)
        targetElement.value?.blur()
      else if (value && !innerFocused.value)
        targetElement.value?.focus({ preventScroll })
    },
  })

  watch(
    targetElement,
    () => {
      focused.value = initialValue
    },
    { immediate: true, flush: 'post' },
  )

  return { focused }
}
