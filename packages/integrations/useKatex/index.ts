import { ref, unref, watch } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import type { KatexOptions } from 'katex'
import Katex from 'katex'

export interface UseKatexOptions extends KatexOptions {
  /**
   * Error callback when `throwOnError` is true
   */
  onError?: (error: unknown) => void
}

export function useKatex(tex: MaybeRef<string>, options?: UseKatexOptions) {
  const rendered = ref('')

  watch(() => unref(tex), () => {
    try {
      rendered.value = Katex.renderToString(unref(tex), options)
    }
    catch (error) {
      if (options?.onError)
        options.onError(error)
    }
  }, { immediate: true })

  return rendered
}
