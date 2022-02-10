import { computed, ref, unref, watch } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'

/**
 * Manipulate CSS variables.
 *
 * @see https://vueuse.org/useCssVar
 * @param prop
 * @param el
 * @param options
 */
export function useCssVar(
  prop: MaybeRef<string>,
  target?: MaybeElementRef,
  { window = defaultWindow }: ConfigurableWindow = {},
) {
  const variable = ref('')
  const elRef = computed(() => unrefElement(target) || window?.document?.documentElement)
  const attr = computed(() => unref(prop))

  watch(
    attr,
    (v) => {
      variable.value = window?.getComputedStyle(elRef.value!).getPropertyValue(v) || ''
    },
  )

  watch(
    elRef,
    (el) => {
      if (el && window)
        variable.value = window.getComputedStyle(el).getPropertyValue(attr.value)
    },
    { immediate: true },
  )

  watch(
    variable,
    (val) => {
      if (elRef.value?.style)
        elRef.value.style.setProperty(attr.value, val)
    },
  )

  return variable
}
