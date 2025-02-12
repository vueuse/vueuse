import type { Fn, MaybeRefOrGetter } from '@vueuse/shared'
import type { ComponentPublicInstance, VNode } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { MaybeElementRef } from '../unrefElement'
import { isIOS, noop } from '@vueuse/shared'
import { toValue } from 'vue'
import { defaultWindow } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useEventListener } from '../useEventListener'

export interface OnClickOutsideOptions extends ConfigurableWindow {
  /**
   * List of elements that should not trigger the event.
   */
  ignore?: MaybeRefOrGetter<(MaybeElementRef | string)[]>
  /**
   * Ignore dragging so the handler does not fire if user drags instead of single clicks
   * @default false
   */
  ignoreDragging?: boolean | {
    /**
     * The distance in pixels the user should be able to drag without triggering the event.
     */
    distance?: number
  }
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

let _iOSWorkaround = false

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
  const {
    window = defaultWindow,
    ignore = [],
    ignoreDragging = false,
    capture = true,
    detectIframe = false,
  } = options

  if (!window)
    return noop

  // Fixes: https://github.com/vueuse/vueuse/issues/1520
  // How it works: https://stackoverflow.com/a/39712411
  if (isIOS && !_iOSWorkaround) {
    _iOSWorkaround = true
    const listenerOptions = { passive: true }
    Array.from(window.document.body.children)
      .forEach(el => useEventListener(el, 'click', noop, listenerOptions))
    useEventListener(window.document.documentElement, 'click', noop, listenerOptions)
  }

  let shouldListen = true
  let stopDragListener: undefined | Function

  const startDragListener = ({ x, y }: PointerEvent) => {
    stopDragListener = useEventListener(window, 'pointermove', (e) => {
      const dX = Math.abs(x - e.x)
      const dY = Math.abs(y - e.y)
      if (dX + dY > 4) {
        shouldListen = false
        stopDragListener?.()
      }
    })
  }

  const shouldIgnore = (event: PointerEvent) => {
    return toValue(ignore).some((target) => {
      if (typeof target === 'string') {
        return Array.from(window.document.querySelectorAll(target))
          .some(el => el === event.target || event.composedPath().includes(el))
      }
      else {
        const el = unrefElement(target)
        return el && (event.target === el || event.composedPath().includes(el))
      }
    })
  }

  /**
   * Determines if the given target has multiple root elements.
   * Referenced from: https://github.com/vuejs/test-utils/blob/ccb460be55f9f6be05ab708500a41ec8adf6f4bc/src/vue-wrapper.ts#L21
   */
  function hasMultipleRoots(target: MaybeElementRef): boolean {
    const vm = toValue(target) as ComponentPublicInstance
    return vm && vm.$.subTree.shapeFlag === 16
  }

  function checkMultipleRoots(target: MaybeElementRef, event: PointerEvent): boolean {
    const vm = toValue(target) as ComponentPublicInstance
    const children = vm.$.subTree && vm.$.subTree.children

    if (children == null || !Array.isArray(children))
      return false

    // @ts-expect-error should be VNode
    return children.some((child: VNode) => child.el === event.target || event.composedPath().includes(child.el))
  }

  const listener = (event: PointerEvent) => {
    stopDragListener?.()
    const el = unrefElement(target)

    if (event.target == null)
      return

    if (!(el instanceof Element) && hasMultipleRoots(target) && checkMultipleRoots(target, event))
      return

    if (!el || el === event.target || event.composedPath().includes(el))
      return

    if (event.detail === 0)
      shouldListen = !shouldIgnore(event)

    if (!shouldListen) {
      shouldListen = true
      return
    }

    handler(event)
  }

  let isProcessingClick = false

  const cleanup = [
    useEventListener(window, 'click', (event: PointerEvent) => {
      if (!isProcessingClick) {
        isProcessingClick = true
        setTimeout(() => {
          isProcessingClick = false
        }, 0)
        listener(event)
      }
    }, { passive: true, capture }),
    useEventListener(window, 'pointerdown', (e) => {
      const el = unrefElement(target)
      shouldListen = !shouldIgnore(e) && !!(el && !e.composedPath().includes(el))
      if (shouldListen && ignoreDragging)
        startDragListener(e)
    }, { passive: true }),
    detectIframe && useEventListener(window, 'blur', (event) => {
      setTimeout(() => {
        const el = unrefElement(target)
        if (
          window.document.activeElement?.tagName === 'IFRAME'
          && !el?.contains(window.document.activeElement)
        ) {
          handler(event as any)
        }
      }, 0)
    }, { passive: true }),
  ].filter(Boolean) as Fn[]

  const stop = () => cleanup.forEach(fn => fn())

  return stop
}
