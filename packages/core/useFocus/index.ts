import type { Ref } from 'vue-demi'
import { computed, watch } from 'vue-demi'
import { isDef } from '@vueuse/shared'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useActiveElement } from '../useActiveElement'
import type { ConfigurableWindow } from '../_configurable'

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

  const activeElement = useActiveElement(options)
  const targetElement = computed(() => unrefElement(target))
  const focused = computed({
    get() {
      return isDef(activeElement.value) && isDef(targetElement.value) && activeElement.value === targetElement.value
    },
    set(value: boolean) {
      if (!value && focused.value)
        targetElement.value?.blur()
      if (value && !focused.value)
        targetElement.value?.focus()
    },
  })

  watch(targetElement, () => { focused.value = initialValue }, { immediate: true, flush: 'post' })

  return { focused }
}
