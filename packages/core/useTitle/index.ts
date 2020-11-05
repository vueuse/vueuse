import { isString } from '@vueuse/shared'
import { ref, watch, Ref, ComputedRef } from 'vue-demi'
import { ConfigurableDocument, defaultDocument } from '../_configurable'

export function useTitle(
  newTitle: Ref<string> | ComputedRef<string> | string | null = null,
  { document = defaultDocument }: ConfigurableDocument = {},
): Ref<string | null> {
  const title = ref(newTitle ?? document?.title ?? null)

  watch(
    title,
    (t, o) => {
      if (isString(t) && t !== o && document)
        document.title = t
    },
    { immediate: true },
  )

  return title
}
