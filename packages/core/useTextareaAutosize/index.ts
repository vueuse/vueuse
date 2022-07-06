import type { MaybeRef } from '@vueuse/shared'
import type { WatchSource } from 'vue-demi'
import { ref, watch } from 'vue-demi'

export interface UseTextareaAutosizeOptions {
  /** Textarea element to autosize. */
  element?: MaybeRef<HTMLTextAreaElement | undefined>
  /** Textarea content. */
  input?: MaybeRef<string | undefined>
  /** Watch sources that should trigger a textarea resize. */
  watch?: WatchSource | Array<WatchSource>
  /** Function called when the textarea size changes. */
  onResize?: () => void
}

export function useTextareaAutosize(options?: UseTextareaAutosizeOptions) {
  const textarea = ref<HTMLTextAreaElement>(options?.element as any)
  const input = ref<string>(options?.input as any)

  function triggerResize() {
    if (!textarea.value)
      return

    textarea.value!.style.height = '1px'
    textarea.value!.style.height = `${textarea.value?.scrollHeight}px`

    options?.onResize?.()
  }

  watch([input, textarea], triggerResize, { immediate: true })

  if (options?.watch)
    watch(options.watch, triggerResize, { immediate: true, deep: true })

  return {
    textarea,
    input,
    triggerResize,
  }
}
