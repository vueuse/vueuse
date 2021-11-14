import { computed, Ref, ref, watch } from 'vue-demi'
import { MaybeElementRef, unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

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
    window = defaultWindow,
  } = options

  const focused = ref(initialValue)

  if (!window) return { focused }

  const onFocus = () => { focused.value = true }
  const onBlur = () => { focused.value = false }

  const target = computed(() => unrefElement(options.target) ?? window)

  useEventListener(target, 'focus', onFocus, { passive: true })
  useEventListener(target, 'blur', onBlur, { passive: true })

  const setFocus = (focused: boolean, oldFocused: boolean | undefined) => {
    if (focused) {
      if (!oldFocused) target.value?.focus()
    }
    else {
      if (oldFocused) target.value?.blur()
    }
  }

  watch(focused, setFocus, { immediate: true, flush: 'post' })
  watch(target, () => {
    setFocus(focused.value, false)
  }, { immediate: true, flush: 'post' })

  return { focused }
}
