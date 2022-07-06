import { readonly, ref, unref, watch } from 'vue-demi'
import { tryOnScopeDispose } from '@vueuse/shared'
import type { MaybeRef } from '@vueuse/shared'

/**
 * Reactive URL representing an object.
 *
 * @see https://vueuse.org/useObjectUrl
 * @param object
 */
export function useObjectUrl(object: MaybeRef<Blob | MediaSource | undefined>) {
  const url = ref<string | undefined>()

  const release = () => {
    if (url.value)
      URL.revokeObjectURL(url.value)

    url.value = undefined
  }

  watch(
    () => unref(object),
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
