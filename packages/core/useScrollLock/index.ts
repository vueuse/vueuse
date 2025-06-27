import type { Fn } from '@vueuse/shared'
import type { MaybeRefOrGetter } from 'vue'
import { isIOS, toRef, tryOnScopeDispose } from '@vueuse/shared'
import { computed, shallowRef, toValue, watch } from 'vue'

import { resolveElement } from '../_resolve-element'
import { useEventListener } from '../useEventListener'

function checkOverflowScroll(ele: Element): boolean {
  const style = window.getComputedStyle(ele)
  if (
    style.overflowX === 'scroll'
    || style.overflowY === 'scroll'
    || (style.overflowX === 'auto' && ele.clientWidth < ele.scrollWidth)
    || (style.overflowY === 'auto' && ele.clientHeight < ele.scrollHeight)
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

const elInitialOverflow = new WeakMap<HTMLElement, CSSStyleDeclaration['overflow']>()

/**
 * Lock scrolling of the element.
 *
 * @see https://vueuse.org/useScrollLock
 * @param element
 */
export function useScrollLock(
  element: MaybeRefOrGetter<HTMLElement | SVGElement | Window | Document | null | undefined>,
  initialState = false,
) {
  const isLocked = shallowRef(initialState)
  let stopTouchMoveListener: Fn | null = null
  let initialOverflow: CSSStyleDeclaration['overflow'] = ''

  watch(toRef(element), (el) => {
    const target = resolveElement(toValue(el))
    if (target) {
      const ele = target as HTMLElement
      if (!elInitialOverflow.get(ele))
        elInitialOverflow.set(ele, ele.style.overflow)

      if (ele.style.overflow !== 'hidden')
        initialOverflow = ele.style.overflow

      if (ele.style.overflow === 'hidden')
        return isLocked.value = true

      if (isLocked.value)
        return ele.style.overflow = 'hidden'
    }
  }, {
    immediate: true,
  })

  const lock = () => {
    const el = resolveElement(toValue(element))
    if (!el || isLocked.value)
      return
    if (isIOS) {
      stopTouchMoveListener = useEventListener(
        el,
        'touchmove',
        (e) => { preventDefault(e as TouchEvent) },
        { passive: false },
      )
    }
    el.style.overflow = 'hidden'
    isLocked.value = true
  }

  const unlock = () => {
    const el = resolveElement(toValue(element))
    if (!el || !isLocked.value)
      return
    if (isIOS)
      stopTouchMoveListener?.()
    el.style.overflow = initialOverflow
    elInitialOverflow.delete(el as HTMLElement)
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
