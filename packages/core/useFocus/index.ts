import { computed, Ref, watch } from 'vue-demi'
import { MaybeElementRef, unrefElement } from '../unrefElement'
import { useActiveElement } from '../useActiveElement'
import { ConfigurableWindow } from '../_configurable'

export interface FocusOptions extends ConfigurableWindow {
  /**
   * Initial value. If set true, then focus will be set on the target
   *
   * @default false
   */
  initialValue?: boolean

  /**
   * The target element for the focus and blur events.
   */
  target?: MaybeElementRef
}

export interface FocusReturn {
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
 * @param options
 */
export function useFocus(options: FocusOptions = {}): FocusReturn {
  const {
    initialValue = false,
  } = options

  const activeElement = useActiveElement(options)
  const target = computed(() => unrefElement(options.target))
  const focused = computed({
    get() {
      return activeElement.value === target.value
    },
    set(value: boolean) {
      if (!value && focused.value)
        target.value?.blur()
      if (value && !focused.value)
        target.value?.focus()
    },
  })

  watch(target, () => { focused.value = initialValue }, { immediate: true, flush: 'post' })

  return { focused }
}
