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
  /** Prevent attaching styles directly to textarea. Useful for adding styles to wrapper or some other custom element. */
  detachStyles?: MaybeRef<boolean>
}

export function useTextareaAutosize(options?: UseTextareaAutosizeOptions) {
  const textarea = ref<HTMLTextAreaElement>(options?.element as any)
  const input = ref<string>(options?.input as any)
  const textareaScrollHeight = ref(1)
  const detachStyles = ref(options?.detachStyles || false)

  function triggerResize() {
    if (!textarea.value)
      return

    let height = 'unset'

    textarea.value!.style.height = '1px'
    textareaScrollHeight.value = textarea.value?.scrollHeight

    // If we don't want to detach style apply scrollHeight to textarea by updating height
    if (!detachStyles.value)
      height = `${textareaScrollHeight.value}px`

    textarea.value!.style.height = height

    options?.onResize?.()
  }

  watch([input, textarea], triggerResize, { immediate: true })

  if (options?.watch)
    watch(options.watch, triggerResize, { immediate: true, deep: true })

  return {
    textarea,
    textareaScrollHeight,
    input,
    triggerResize,
  }
}

export type UseTextareaAutosizeReturn = ReturnType<typeof useTextareaAutosize>
