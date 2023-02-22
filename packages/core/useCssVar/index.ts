import { useMutationObserver } from '@vueuse/core'
import { computed, ref, watch } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'

export interface UseCssVarOptions extends ConfigurableWindow {
  initialValue?: string
  /**
   * Whether to update synchronously when CSS variables are modified by other means
   * @default false
   */
  sync?: boolean
}

/**
 * Manipulate CSS variables.
 *
 * @see https://vueuse.org/useCssVar
 * @param prop
 * @param target
 * @param options
 */
export function useCssVar(
  prop: MaybeComputedRef<string>,
  target?: MaybeElementRef,
  options: UseCssVarOptions = {},
) {
  const { window = defaultWindow, initialValue = '', sync = false } = options
  const variable = ref(initialValue)
  const elRef = computed(() => unrefElement(target) || window?.document?.documentElement)

  function updateCssVar() {
    const key = resolveUnref(prop)
    const el = resolveUnref(elRef)
    if (el && window) {
      const value = window.getComputedStyle(el).getPropertyValue(key)?.trim()
      variable.value = value || initialValue
    }
  }

  sync && useMutationObserver(elRef, updateCssVar, { attributes: true, window: defaultWindow })

  watch(
    [elRef, () => resolveUnref(prop)],
    updateCssVar,
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
