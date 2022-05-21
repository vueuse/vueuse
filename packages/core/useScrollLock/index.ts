import { computed, ref, unref, watch } from 'vue-demi'
import type { Fn, MaybeRef } from '@vueuse/shared'
import { isIOS, tryOnScopeDispose } from '@vueuse/shared'

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

let scrollbarSize: null | {
  horizontal: string
  vertical: string
} = null

/**
 * Lock scrolling of the element.
 *
 * @see https://vueuse.org/useScrollLock
 * @param element
 */
export function useScrollLock(
  element: MaybeRef<HTMLElement | SVGElement | Window | Document | null | undefined>,
  initialState = false,
  option: {
    avoidShake?: boolean
  } = {}
) {
  const isLocked = ref(initialState)
  let stopTouchMoveListener: Fn | null = null
  let initialOverflow: CSSStyleDeclaration['overflow']

  if (option.avoidShake && !scrollbarSize) {
    scrollbarSize = getScrollbarSize()
  }


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

  const previousStatus = {
    padding: {
      bottom: '',
      right: ''
    },
    isLocked: {
      horizontal: false,
      vertical: false,
    }
  }

  const lock = () => {
    const ele = (unref(element) as HTMLElement)
    if (!ele || isLocked.value)
      return

    if (option.avoidShake) {
      const isLockedHorizontal = ele.clientWidth !== ele.scrollWidth
      const isLockedVertical = ele.clientHeight !== ele.scrollHeight

      previousStatus.isLocked.horizontal = isLockedHorizontal
      previousStatus.isLocked.vertical = isLockedVertical

      if (isLockedHorizontal) {
        previousStatus.padding.bottom = ele.style.paddingBottom

        ele.style.paddingBottom = ele.style.paddingBottom ? `calc(${ele.style.paddingBottom} + ${scrollbarSize!.vertical})` : scrollbarSize!.vertical
      }

      if (isLockedVertical) {
        previousStatus.padding.right = ele.style.paddingRight
        ele.style.paddingRight = ele.style.paddingRight ? `calc(${ele.style.paddingRight} + ${scrollbarSize!.vertical})` : scrollbarSize!.vertical
      }
    }

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


    if (previousStatus.isLocked.vertical) {
      ele.style.paddingRight = previousStatus.padding.right
    }

    if (previousStatus.isLocked.horizontal) {
      ele.style.paddingBottom = previousStatus.padding.bottom
    }

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

/**
 * based on https://stackoverflow.com/a/13382873
 */
 function getScrollbarSize() {
  // Creating invisible container
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll' // forcing scrollbar to appear
  document.body.appendChild(outer)

  // Creating inner element and placing it in the container
  const inner = document.createElement('div')
  outer.appendChild(inner)

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  const scrollbarHeight = outer.offsetHeight - inner.offsetHeight

  // Removing temporary elements from the DOM
  outer.parentNode?.removeChild(outer)

  return {
    vertical: scrollbarWidth + 'px',
    horizontal: scrollbarHeight + 'px'
  }
}
