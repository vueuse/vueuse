import { computed, ref, unref, watch } from 'vue-demi'
import type { Fn, MaybeRef } from '@vueuse/shared'
import { isClient, tryOnScopeDispose } from '@vueuse/shared'

import { useEventListener } from '../useEventListener'

function preventDefault(rawEvent: TouchEvent): boolean {
  const e = rawEvent || window.event
  // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom).
  if (e.touches.length > 1)
    return true

  if (e.preventDefault)
    e.preventDefault()

  return false
}

// TODO: move to @vueuse/share
const isIOS = /* #__PURE__ */ isClient && window?.navigator && window?.navigator?.platform && /iP(ad|hone|od)/.test(window?.navigator?.platform)

/**
 * Lock scrolling of the element.
 *
 * @see https://vueuse.org/useScrollLock
 * @param element
 */
export function useScrollLock(
  element: MaybeRef<HTMLElement | SVGElement | Window | Document | null | undefined>,
  initialState = false,
) {
  const isLocked = ref(initialState)
  let stopTouchMoveListener: Fn | null = null
  let initialOverflow: CSSStyleDeclaration['overflow']

  watch(() => unref(element), (el) => {
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
    const ele = (unref(element) as HTMLElement)
    if (!ele || isLocked.value)
      return
    if (isIOS) {
      stopTouchMoveListener = useEventListener(
        ele,
        'touchmove',
        preventDefault,
        { passive: false },
      )
    }
    ele.style.overflow = 'hidden'
    isLocked.value = true
  }

  const unlock = () => {
    const ele = (unref(element) as HTMLElement)
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
