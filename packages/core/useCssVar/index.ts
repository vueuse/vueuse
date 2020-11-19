import { ref, watch, unref } from 'vue-demi'
import { MaybeRef, tryOnMounted } from '@vueuse/shared'
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

  const varRef = ref('')
  const elRef = ref(unref(el) || window.document.documentElement)

  tryOnMounted(() => {
    varRef.value = window.getComputedStyle(elRef.value).getPropertyValue(prop)
  })

  watch(
    varRef,
    (val) => {
      if (elRef.value?.style)
        elRef.value.style.setProperty(prop, val)
    },
  )

  return varRef
}
