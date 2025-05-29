import type { MaybeRefOrGetter, WatchOptions } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { tryOnMounted } from '@vueuse/shared'
import { readonly, shallowRef, toValue, watch } from 'vue'
import { defaultWindow } from '../_configurable'

export interface UseElementBySelectorOptions extends WatchOptions {
  window?: ConfigurableWindow['window']
}

export function useElementBySelector<TElement extends Element = HTMLElement>(
  selector: MaybeRefOrGetter<string>,
  options: UseElementBySelectorOptions = {},
) {
  const {
    window = defaultWindow,
    immediate = true,
  } = options

  const el = shallowRef<TElement | null>()
  const select = (newSelector: string): TElement | null | undefined => el.value = window?.document.querySelector<TElement>(newSelector)

  tryOnMounted(() => select(toValue(selector)))

  watch(
    () => toValue(selector),
    newSelector => select(newSelector),
    { immediate },
  )

  return readonly(el)
}
