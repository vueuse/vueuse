import type { MaybeRefOrGetter } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeElementRef } from '../unrefElement'
import { computed, shallowRef, toValue, watch } from 'vue'
import { defaultWindow } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useMutationObserver } from '../useMutationObserver'

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
  const variable = shallowRef(initialValue)

  // Element reference for reading - can fallback to documentElement to read global variables
  const readElRef = computed(() => unrefElement(target) || window?.document?.documentElement)

  // Element reference for writing - only allows writing when target is explicitly provided
  const writeElRef = computed(() => unrefElement(target))

  function updateCssVar() {
    const key = toValue(prop)
    const el = toValue(readElRef)
    if (el && window && key) {
      const value = window.getComputedStyle(el).getPropertyValue(key)?.trim()
      variable.value = value || variable.value || initialValue
    }
  }

  if (observe) {
    useMutationObserver(readElRef, updateCssVar, {
      attributeFilter: ['style', 'class'],
      window,
    })
  }

  watch(
    [writeElRef, () => toValue(prop)],
    (_, old) => {
      // Only clean up old properties when there's an explicit write target
      if (old[0] && old[1])
        old[0].style.removeProperty(old[1])
      updateCssVar()
    },
    { immediate: true },
  )

  watch(
    [variable, writeElRef],
    ([val, el]) => {
      const raw_prop = toValue(prop)
      // Only set CSS variable when there's an explicit write target
      if (el?.style && raw_prop) {
        if (val == null)
          el.style.removeProperty(raw_prop)
        else
          el.style.setProperty(raw_prop, val)
      }
    },
    { immediate: true },
  )

  return variable
}
