import { isClient, isString } from '@vueuse/shared'
import { ref, watch } from 'vue-demi'

export function useTitle(
  override: string | null = null,
  document = isClient ? window.document : null,
) {
  const title = ref<string | null>(isString(override) ? override : document?.title || null)

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
