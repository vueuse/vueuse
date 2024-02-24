import { computed, ref, watch } from 'vue-demi'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toValue } from '@vueuse/shared'
import { useMutationObserver } from '../useMutationObserver'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'

export interface UseCssVarOptions extends ConfigurableWindow {
  initialValue?: string
  /**
   * Use MutationObserver to monitor variable changes
   * @default false
   */
  observe?: boolean
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
  prop: MaybeRefOrGetter<string | null | undefined>,
  target?: MaybeElementRef,
  options: UseCssVarOptions = {},
) {
  const { window = defaultWindow, initialValue, observe = false } = options
  const variable = ref<string | null | undefined>(initialValue)
  const elRef = computed(() => unrefElement(target) || window?.document?.documentElement)

  function updateCssVar() {
    const key = toValue(prop)
    const el = toValue(elRef)
    if (el && window && key) {
      const value = window.getComputedStyle(el).getPropertyValue(key)?.trim()
      variable.value = value || initialValue
    }
  }

  if (observe) {
    useMutationObserver(elRef, updateCssVar, {
      attributeFilter: ['style', 'class'],
      window,
    })
  }

  watch(
    [elRef, () => toValue(prop)],
    (_, old) => {
      if (old[0] && old[1] && window)
        window.getComputedStyle(old[0]).removeProperty(old[1])
      updateCssVar()
    },
    { immediate: true },
  )

  watch(
    variable,
    (val) => {
      const raw_prop = toValue(prop)
      if (elRef.value?.style && raw_prop) {
        if (val == null)
          elRef.value.style.removeProperty(raw_prop)
        else
          elRef.value.style.setProperty(raw_prop, val)
      }
    },
  )

  return variable
}
