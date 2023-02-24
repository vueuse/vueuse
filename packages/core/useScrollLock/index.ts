import { computed, ref, watch } from 'vue-demi'
import type { Fn, MaybeComputedRef } from '@vueuse/shared'
import { isIOS, resolveRef, resolveUnref, tryOnScopeDispose } from '@vueuse/shared'

import { useEventListener } from '../useEventListener'

function checkOverflowScroll(ele: Element): boolean {
  const style = window.getComputedStyle(ele)
  if (
    style.overflowX === 'scroll'
    || style.overflowY === 'scroll'
    || (style.overflowX === 'auto' && ele.clientHeight < ele.scrollHeight)
    || (style.overflowY === 'auto' && ele.clientWidth < ele.scrollWidth)
  ) {
    return true
  }
  else {
    const parent = ele.parentNode as Element

    if (!parent || parent.tagName === 'BODY')
      return false

    return checkOverflowScroll(parent)
  }
}

function preventDefault(rawEvent: TouchEvent): boolean {
  const e = rawEvent || window.event

  const _target = e.target as Element

  // Do not prevent if element or parentNodes have overflow: scroll set.
  if (checkOverflowScroll(_target))
    return false

  // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom).
  if (e.touches.length > 1)
    return true

  if (e.preventDefault)
    e.preventDefault()

  return false
}

/**
 * Lock scrolling of the element.
 *
 * @see https://vueuse.org/useScrollLock
 * @param element
 */
export function useScrollLock(
  element: MaybeComputedRef<HTMLElement | SVGElement | Window | Document | null | undefined>,
  initialState = false,
) {
  const isLocked = ref(initialState)
  let stopTouchMoveListener: Fn | null = null
  let initialOverflow: CSSStyleDeclaration['overflow']

  watch(resolveRef(element), (el) => {
    if (el) {
      const ele = el as HTMLElement
      initialOverflow = ele.style.overflow
      if (isLocked.value)
        ele.style.overflow = 'hidden'
    }
  }, {
    immediate: true,
  })

  const lock = () => {
    const ele = (resolveUnref(element) as HTMLElement)
    if (!ele || isLocked.value)
      return
    if (isIOS) {
      stopTouchMoveListener = useEventListener(
        ele,
        'touchmove',
        (e) => { preventDefault(e as TouchEvent) },
        { passive: false },
      )
    }
    ele.style.overflow = 'hidden'
    isLocked.value = true
  }

  const unlock = () => {
    const ele = (resolveUnref(element) as HTMLElement)
    if (!ele || !isLocked.value)
      return
    isIOS && stopTouchMoveListener?.()
    ele.style.overflow = initialOverflow
    isLocked.value = false
  }

  tryOnScopeDispose(unlock)

  return computed<boolean>({
    get() {
      return isLocked.value
    },
    set(v) {
      if (v)
        lock()
      else unlock()
    },
  })
}
