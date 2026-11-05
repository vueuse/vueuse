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

  // Track if target has ever had a truthy value
  let targetHadValue = false
  // Track the initial target value to distinguish undefined from null
  const initialTargetValue = toValue(target)

  const elRef = computed(() => {
    const element = unrefElement(target)

    if (element) {
      targetHadValue = true
      return element
    }

    // If target had a value before, don't use fallback
    if (targetHadValue) {
      return null
    }

    // If initial target was explicitly null, don't use documentElement
    if (initialTargetValue === null) {
      return null
    }

    // If initial target was undefined, use documentElement as fallback
    return window?.document?.documentElement
  })

  function updateCssVar() {
    const key = toValue(prop)
    const el = toValue(elRef)
    // Only update CSS variable if we have a valid element
    if (el && window && key) {
      const value = window.getComputedStyle(el).getPropertyValue(key)?.trim()
      variable.value = value || variable.value || initialValue
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
      if (old[0] && old[1])
        old[0].style.removeProperty(old[1])
      updateCssVar()
    },
    { immediate: true },
  )

  watch(
    [variable, elRef],
    ([val, el]) => {
      const raw_prop = toValue(prop)
      // Only set CSS property if we have a valid element
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
