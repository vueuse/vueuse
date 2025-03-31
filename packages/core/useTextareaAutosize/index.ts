import type { Fn } from '@vueuse/shared'
import type { MaybeRef, WatchSource } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { toRef } from '@vueuse/shared'
import { nextTick, shallowRef, toValue, watch } from 'vue'
import { defaultWindow } from '../_configurable'
import { useResizeObserver } from '../useResizeObserver'

export interface UseTextareaAutosizeOptions extends ConfigurableWindow {
  /** Textarea element to autosize. */
  element?: MaybeRef<HTMLTextAreaElement | undefined>
  /** Textarea content. */
  input?: MaybeRef<string>
  /** Watch sources that should trigger a textarea resize. */
  watch?: WatchSource | Array<WatchSource>
  /** Function called when the textarea size changes. */
  onResize?: () => void
  /** Specify style target to apply the height based on textarea content. If not provided it will use textarea it self.  */
  styleTarget?: MaybeRef<HTMLElement | undefined>
  /** Specify the style property that will be used to manipulate height. Can be `height | minHeight`. Default value is `height`. */
  styleProp?: 'height' | 'minHeight'
}

/**
 * Call window.requestAnimationFrame(), if not available, just call the function
 *
 * @param window
 * @param fn
 */
function tryRequestAnimationFrame(
  window: Window | undefined = defaultWindow,
  fn: Fn,
) {
  if (window && typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(fn)
  }
  else {
    fn()
  }
}

export function useTextareaAutosize(options: UseTextareaAutosizeOptions = {}) {
  const { window = defaultWindow } = options
  const textarea = toRef(options?.element)
  const input = toRef(options?.input ?? '')
  const styleProp = options?.styleProp ?? 'height'
  const textareaScrollHeight = shallowRef(1)
  const textareaOldWidth = shallowRef(0)

  function triggerResize() {
    if (!textarea.value)
      return

    let height = ''

    textarea.value.style[styleProp] = '1px'
    textareaScrollHeight.value = textarea.value?.scrollHeight
    const _styleTarget = toValue(options?.styleTarget)
    // If style target is provided update its height
    if (_styleTarget)
      _styleTarget.style[styleProp] = `${textareaScrollHeight.value}px`
    // else update textarea's height by updating height variable
    else
      height = `${textareaScrollHeight.value}px`

    textarea.value.style[styleProp] = height
  }

  watch([input, textarea], () => nextTick(triggerResize), { immediate: true })

  watch(textareaScrollHeight, () => options?.onResize?.())

  useResizeObserver(textarea, ([{ contentRect }]) => {
    if (textareaOldWidth.value === contentRect.width)
      return

    tryRequestAnimationFrame(window, () => {
      textareaOldWidth.value = contentRect.width
      triggerResize()
    })
  })

  if (options?.watch)
    watch(options.watch, triggerResize, { immediate: true, deep: true })

  return {
    textarea,
    input,
    triggerResize,
  }
}

export type UseTextareaAutosizeReturn = ReturnType<typeof useTextareaAutosize>
