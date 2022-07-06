import { computed, ref, watch } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'

export interface UseCssVarOptions extends ConfigurableWindow {
  initialValue?: string
}

/**
 * Manipulate CSS variables.
 *
 * @see https://vueuse.org/useCssVar
 * @param prop
 * @param target
 * @param initialValue
 * @param options
 */
export function useCssVar(
  prop: MaybeComputedRef<string>,
  target?: MaybeElementRef,
  { window = defaultWindow, initialValue = '' }: UseCssVarOptions = {},
) {
  const variable = ref(initialValue)
  const elRef = computed(() => unrefElement(target) || window?.document?.documentElement)

  watch(
    [elRef, () => resolveUnref(prop)],
    ([el, prop]) => {
      if (el && window) {
        const value = window.getComputedStyle(el).getPropertyValue(prop)?.trim()
        variable.value = value || initialValue
      }
    },
    { immediate: true },
  )

  watch(
    variable,
    (val) => {
      if (elRef.value?.style)
        elRef.value.style.setProperty(resolveUnref(prop), val)
    },
  )

  return variable
}
