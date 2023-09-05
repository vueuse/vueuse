import type { MaybeRef } from '@vueuse/shared'
import { toValue } from '@vueuse/shared'
import type { WatchSource } from 'vue-demi'
import { nextTick, ref, watch } from 'vue-demi'
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

    textareaScrollHeight.value = textarea.value?.scrollHeight

    // If style target is provided update its height
    if (options?.styleTarget)
      toValue(options.styleTarget).style.height = `${textareaScrollHeight.value}px`
    // else update textarea's height by updating height variable
    else
      height = `${textareaScrollHeight.value}px`

    // If the text's height is greater than the target's height, adapt the target's height to the text's height
    if (textarea.value?.scrollHeight > textarea.value?.clientHeight)
      textarea.value!.style.height = height

    options?.onResize?.()
  }

  watch([input, textarea], () => nextTick(triggerResize), { immediate: true })

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
