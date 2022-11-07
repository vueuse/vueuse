import type { Fn } from '@vueuse/shared'
import { noop } from '@vueuse/shared'
import { ref } from 'vue-demi'
import type { MaybeElementRef } from '../unrefElement'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

let IOSWorkaroundInitialized = false

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

export type OnClickOutsideHandler<T extends { detectIframe: OnClickOutsideOptions['detectIframe'] } = { detectIframe: false }> = (evt: T['detectIframe'] extends true ? PointerEvent | FocusEvent : PointerEvent) => void

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
  handler: OnClickOutsideHandler<{ detectIframe: T['detectIframe'] }>,
  options: T = {} as T,
) {
  const { window = defaultWindow, ignore, capture = true, detectIframe = false } = options

  if (!window)
    return

  if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !IOSWorkaroundInitialized) {
    IOSWorkaroundInitialized = true
    Array.from(window.document.body.children)
      .filter(el => !/IFRAME|OBJECT|EMBED|LINK|SCRIPT|STYLE|TEMPLATE/.test(el.tagName))
      .forEach(el => el.addEventListener('click', noop))
  }

  const shouldListen = ref(true)

  const listener = (event: PointerEvent) => {
    const el = unrefElement(target)

    if (!el || el === event.target || event.composedPath().includes(el) || !shouldListen.value)
      return

    handler(event)
  }

  const shouldIgnore = (event: PointerEvent) => {
    return ignore && ignore.some((target) => {
      const el = unrefElement(target)
      return el && (event.target === el || event.composedPath().includes(el))
    })
  }

  const cleanup = [
    useEventListener(window, 'click', listener, { passive: true, capture }),
    useEventListener(window, 'pointerdown', (e) => {
      const el = unrefElement(target)
      shouldListen.value = !!el && !e.composedPath().includes(el) && !shouldIgnore(e)
    }, { passive: true }),
    detectIframe && useEventListener(window, 'blur', (event) => {
      const el = unrefElement(target)
      if (
        document.activeElement?.tagName === 'IFRAME'
        && !el?.contains(document.activeElement)
      )
        handler(event as any)
    }),
  ].filter(Boolean) as Fn[]

  const stop = () => cleanup.forEach(fn => fn())

  return stop
}
