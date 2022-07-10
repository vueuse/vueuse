import type { Fn } from '@vueuse/shared'
import { ref } from 'vue-demi'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface OnClickOutsideOptions extends ConfigurableWindow {
  /**
   * List of elements that should not trigger the event.
   */
  ignore?: MaybeElementRef[]
  /**
   * Use capturing phase for internal event listener.
   * @default true
   */
  capture?: boolean
  /**
   * Run handler function if focus moves to an iframe.
   * @default false
   */
  detectIframe?: boolean
}

/**
 * Listen for clicks outside of an element.
 *
 * @see https://vueuse.org/onClickOutside
 * @param target
 * @param handler
 * @param options
 */
export function onClickOutside<T extends OnClickOutsideOptions>(
  target: MaybeElementRef,
  handler: <E = T['detectIframe'] extends true ? PointerEvent | FocusEvent : PointerEvent>(evt: E) => void,
  options: T = {} as T,
) {
  const { window = defaultWindow, ignore, capture = true, detectIframe = false } = options

  if (!window)
    return

  const shouldListen = ref(true)

  let fallback: number

  const listener = (event: PointerEvent) => {
    window.clearTimeout(fallback)

    const el = unrefElement(target)
    const composedPath = event.composedPath()

    if (!el || el === event.target || composedPath.includes(el) || !shouldListen.value)
      return

    if (ignore && ignore.length > 0) {
      if (ignore.some((target) => {
        const el = unrefElement(target)
        return el && (event.target === el || composedPath.includes(el))
      }))
        return
    }

    handler(event)
  }

  const cleanup = [
    useEventListener(window, 'click', listener, { passive: true, capture }),
    useEventListener(window, 'pointerdown', (e) => {
      const el = unrefElement(target)
      shouldListen.value = !!el && !e.composedPath().includes(el)
    }, { passive: true }),
    useEventListener(window, 'pointerup', (e) => {
      if (e.button === 0) {
        const path = e.composedPath()
        e.composedPath = () => path
        fallback = window.setTimeout(() => listener(e), 50)
      }
    }, { passive: true }),
    detectIframe && useEventListener(window, 'blur', (event) => {
      const el = unrefElement(target)
      if (
        document.activeElement?.tagName === 'IFRAME'
        && !el?.contains(document.activeElement)
      )
        handler(event)
    }),
  ].filter(Boolean) as Fn[]

  const stop = () => cleanup.forEach(fn => fn())

  return stop
}
