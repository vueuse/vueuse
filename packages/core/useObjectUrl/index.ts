import type { MaybeRefOrGetter } from '@vueuse/shared'
import { tryOnScopeDispose } from '@vueuse/shared'
import { readonly, ref, toValue, watch } from 'vue'

/**
 * Reactive URL representing an object.
 *
 * @see https://vueuse.org/useObjectUrl
 * @param object
 */
export function useObjectUrl(object: MaybeRefOrGetter<Blob | MediaSource | null | undefined>) {
  const url = ref<string | undefined>()

  const release = () => {
    if (url.value)
      URL.revokeObjectURL(url.value)

    url.value = undefined
  }

  watch(
    () => toValue(object),
    (newObject) => {
      release()

      if (newObject)
        url.value = URL.createObjectURL(newObject)
    },
    { immediate: true },
  )

  tryOnScopeDispose(release)

  return readonly(url)
}
