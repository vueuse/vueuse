import { unref, ref } from 'vue-demi'
import { MaybeRef, isClient, Fn } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'

function preventDefault(rawEvent: TouchEvent): boolean {
  const e = rawEvent || window.event
  // Do not prevent if the event has more than one touch (usually meaning this is a multi touch gesture like pinch to zoom).
  if (e.touches.length > 1) return true

  if (e.preventDefault) e.preventDefault()

  return false
}

const isIosDevice
  = isClient
  && window?.navigator
  && window?.navigator?.platform
  && /iP(ad|hone|od)/.test(window?.navigator?.platform)

/**
 * Lock scrolling of the element.
 *
 * @see https://vueuse.org/useLockScroll
 * @param element
 */
export function useLockScroll(
  element: MaybeRef<HTMLElement | SVGElement | Window | Document | null | undefined>,
  initialState = false,
) {
  const lockState = ref(initialState)
  let touchMoveListener: Fn | null = null
  let initialOverflow: CSSStyleDeclaration['overflow']

  const lock = () => {
    const ele = (unref(element) as HTMLElement)
    if (!ele || lockState.value) return
    initialOverflow = ele.style.overflow
    if (isIosDevice) {
      touchMoveListener = useEventListener(
        document,
        'touchmove',
        preventDefault,
        { passive: false },
      )
    }
    else {
      ele.style.overflow = 'hidden'
    }
    lockState.value = true
  }

  const unlock = () => {
    const ele = (unref(element) as HTMLElement)
    if (!ele || !lockState.value) return
    isIosDevice ? touchMoveListener?.() : ele.style.overflow = initialOverflow
    lockState.value = false
  }

  return {
    lockState,
    lock,
    unlock,
  }
}

export type UseLockScroll = ReturnType<typeof useLockScroll>
