import { isClient, isString } from '@vueuse/shared'
import { ref, watch, Ref, ComputedRef, isRef } from 'vue-demi'

export function useTitle(
  newTitle: Ref<string> | ComputedRef<string> | string | null = null,
  document = isClient ? window.document : null,
) {
  const title = isRef(newTitle)
    ? newTitle
    : ref<string | null>(
      isString(newTitle)
        ? newTitle
        : document?.title || null,
    )

  watch(
    title,
    (t, o) => {
      if (isString(t) && t !== o && document)
        document.title = t
    },
    {
      immediate: true,
    },
  )

  return title
}
