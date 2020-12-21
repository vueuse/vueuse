import { ref, watch } from 'vue-demi'
import { MaybeRef } from '@vueuse/shared'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

/**
 * Manipulate CSS variables.
 *
 * @see   {@link https://vueuse.js.org/useCssVar}
 * @param prop
 * @param el
 * @param options
 */
export function useCssVar(
  prop: string,
  el?: MaybeRef<HTMLElement | null>,
  { window = defaultWindow }: ConfigurableWindow = {},
) {
  if (!window)
    return ref('')

  const variable = ref('')
  const _el = ref(el || window.document.documentElement)

  watch(
    _el,
    () => {
      if (_el.value)
        variable.value = window.getComputedStyle(_el.value).getPropertyValue(prop)
    },
    { immediate: true },
  )

  watch(
    variable,
    (val) => {
      if (_el.value?.style)
        _el.value.style.setProperty(prop, val)
    },
  )

  return variable
}
