import type { MaybeRefOrGetter } from 'vue'
import { tryOnMounted } from '@vueuse/shared'
import { ref as deepRef, toValue, watch } from 'vue'

export function useElementBySelector(selector: MaybeRefOrGetter<string>) {
  const el = deepRef<Element | null>()
  const select = (): Element | null => el.value = document.querySelector(toValue(selector))

  tryOnMounted(select)

  watch(
    () => toValue(selector),
    select,
    { immediate: true },
  )

  return el
}
