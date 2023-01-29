import type { Ref } from 'vue-demi'
import { computed, ref, watch } from 'vue-demi'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import type { ConfigurableWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

export interface UseFocusOptions extends ConfigurableWindow {
  /**
   * Initial value. If set true, then focus will be set on the target
   *
   * @default false
   */
  initialValue?: boolean
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
  const { initialValue = false } = options

  const innerFocused = ref(false)
  const targetElement = computed(() => unrefElement(target))

  useEventListener(targetElement, 'focus', () => innerFocused.value = true)
  useEventListener(targetElement, 'blur', () => innerFocused.value = false)

  const focused = computed({
    get: () => innerFocused.value,
    set(value: boolean) {
      if (!value && innerFocused.value)
        targetElement.value?.blur()
      else if (value && !innerFocused.value)
        targetElement.value?.focus()
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
