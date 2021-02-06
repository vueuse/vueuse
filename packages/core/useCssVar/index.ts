import { computed, ref, watch } from 'vue-demi'
import { ConfigurableWindow, defaultWindow } from '../_configurable'
import { MaybeElementRef, unrefElement } from '../unrefElement'

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
  target?: MaybeElementRef,
  { window = defaultWindow }: ConfigurableWindow = {},
) {
  const variable = ref('')
  const elRef = computed(() => unrefElement(target) || window?.document?.documentElement)

  watch(
    elRef,
    (el) => {
      if (el && window)
        variable.value = window.getComputedStyle(el).getPropertyValue(prop)
    },
    { immediate: true },
  )

  watch(
    variable,
    (val) => {
      if (elRef.value?.style)
        elRef.value.style.setProperty(prop, val)
    },
  )

  return variable
}
