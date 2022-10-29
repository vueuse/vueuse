import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref } from '@vueuse/shared'
import { computed, ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'

export interface UseScrollProgressOptions {
  /**
   * Optionally specify a scroll behavior of `auto` (default, not smooth scrolling) or
   * `smooth` (for smooth scrolling) which takes effect when changing the `x` or `y` refs.
   *
   * @default 'auto'
   */
  behavior?: MaybeComputedRef<ScrollBehavior>
}

/**
 * Reactive scroll progress
 *
 * @see https://vueuse.org/core/useScrollProgress
 * @param element
 * @param options
 */
export function useScrollProgress(
  element: MaybeComputedRef<HTMLElement | SVGElement | Window | Document | null | undefined>,
  options: UseScrollProgressOptions = {},
) {
  const {
    behavior,
  } = options

  const x = ref(0)
  const y = ref(0)

  function scrollTo(_x: number | undefined, _y: number | undefined) {
    const _element = resolveUnref(element)

    if (!_element)
      return

    (_element instanceof Document ? document.body : _element)?.scrollTo({
      top: resolveUnref(_y) ?? y.value,
      left: resolveUnref(_x) ?? x.value,
      behavior: resolveUnref(behavior),
    })
  }

  const elementDiffWidth = computed(() => {
    const _el = resolveUnref(element)
    if (!_el)
      return NaN

    if (_el instanceof Document)
      return _el.body.scrollWidth - _el.body.clientWidth
    else if (_el instanceof Window)
      return _el.scrollX - _el.innerWidth
    else
      return _el.scrollWidth - _el.clientWidth
  })

  const elementDiffHeight = computed(() => {
    const _el = resolveUnref(element)
    if (!_el)
      return NaN

    if (_el instanceof Document)
      return _el.body.scrollHeight - _el.body.clientHeight
    else if (_el instanceof Window)
      return _el.scrollY - _el.innerHeight
    else
      return _el.scrollHeight - _el.clientHeight
  })

  const onScrollHandler = (e: Event) => {
    const eventTarget = (
      e.target === document ? (e.target as Document).documentElement : e.target
    ) as HTMLElement

    const scrollLeft = eventTarget.scrollLeft
    x.value = scrollLeft

    let scrollTop = eventTarget.scrollTop

    // patch for mobile compatible
    if (e.target === document && !scrollTop)
      scrollTop = document.body.scrollTop

    y.value = eventTarget.scrollTop
  }

  useEventListener(
    element,
    'scroll',
    onScrollHandler,
  )

  const progressX = computed({
    get() {
      return x.value / elementDiffWidth.value
    },
    set(x) {
      scrollTo(x * elementDiffWidth.value, undefined)
    },
  })

  const progressY = computed({
    get() {
      return y.value / elementDiffHeight.value
    },
    set(y) {
      scrollTo(undefined, y * elementDiffHeight.value)
    },
  })

  return {
    progressX,
    progressY,
  }
}

export type UseScrollProgressReturn = ReturnType<typeof useScrollProgress>
