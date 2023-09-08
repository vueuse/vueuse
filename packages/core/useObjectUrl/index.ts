import { readonly, ref, watch } from 'vue-demi'
import { toValue, tryOnScopeDispose } from '@vueuse/shared'
import type { MaybeRefOrGetter } from '@vueuse/shared'

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
