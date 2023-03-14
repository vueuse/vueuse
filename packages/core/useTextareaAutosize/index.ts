import type { MaybeRef } from '@vueuse/shared'
import type { WatchSource } from 'vue-demi'
import { ref, unref, watch } from 'vue-demi'
import { useResizeObserver } from '../useResizeObserver'

export interface UseTextareaAutosizeOptions {
  /** Textarea element to autosize. */
  element?: MaybeRef<HTMLTextAreaElement | undefined>
  /** Textarea content. */
  input?: MaybeRef<string | undefined>
  /** Watch sources that should trigger a textarea resize. */
  watch?: WatchSource | Array<WatchSource>
  /** Function called when the textarea size changes. */
  onResize?: () => void
  /** Specify style target to apply the height based on textarea content. If not provided it will use textarea it self.  */
  styleTarget?: MaybeRef<HTMLElement>
}

export function useTextareaAutosize(options?: UseTextareaAutosizeOptions) {
  const textarea = ref<HTMLTextAreaElement>(options?.element as any)
  const input = ref<string>(options?.input as any)
  const textareaScrollHeight = ref(1)

  function triggerResize() {
    if (!textarea.value)
      return

    let height = ''

    textarea.value!.style.height = '1px'
    textareaScrollHeight.value = textarea.value?.scrollHeight

    // If style target is provided update its height
    if (options?.styleTarget)
      unref(options.styleTarget).style.height = `${textareaScrollHeight.value}px`
    // else update textarea's height by updating height variable
    else
      height = `${textareaScrollHeight.value}px`

    textarea.value!.style.height = height

    options?.onResize?.()
  }

  watch([input, textarea], triggerResize, { immediate: true })

  useResizeObserver(textarea, () => triggerResize())

  if (options?.watch)
    watch(options.watch, triggerResize, { immediate: true, deep: true })

  return {
    textarea,
    input,
    triggerResize,
  }
}

export type UseTextareaAutosizeReturn = ReturnType<typeof useTextareaAutosize>
