import type { MaybeRefInitials, ReadonlyRefs } from '@vueuse/shared'
import type { MaybeComputedElementRef } from '../unrefElement'
import type { UseResizeObserverOptions } from '../useResizeObserver'
import { toArray, tryOnMounted } from '@vueuse/shared'
import { computed, shallowReadonly, shallowRef, toValue, watch } from 'vue'
import { defaultWindow } from '../_configurable'
import { unrefElement } from '../unrefElement'
import { useResizeObserver } from '../useResizeObserver'

export interface ElementSize {
  width: number
  height: number
}

export interface UseElementSizeState {
  /**
   * Element width
   *
   * @default 0
   */
  width: number
  /**
   * Element height
   *
   * @default 0
   */
  height: number
}

export interface UseElementSizeOptions extends UseResizeObserverOptions {
  /**
   * Initial values for the returned state, used before the element is measured
   * (e.g. during SSR). A passed ref is used as the internal state.
   */
  initials?: MaybeRefInitials<UseElementSizeState>
}

export interface UseElementSizeReturn extends ReadonlyRefs<UseElementSizeState> {
  stop: () => void
}

/**
 * Reactive size of an HTML element.
 *
 * @see https://vueuse.org/useElementSize
 * @deprecated Passing the initial size as second argument is deprecated. Use `useElementSize(target, { initials: { width, height } })` instead. Will be removed in v17.
 */
export function useElementSize(
  target: MaybeComputedElementRef,
  initialSize: ElementSize | undefined,
  options?: UseElementSizeOptions,
): UseElementSizeReturn
/**
 * Reactive size of an HTML element.
 *
 * @see https://vueuse.org/useElementSize
 */
export function useElementSize(
  target: MaybeComputedElementRef,
  options?: UseElementSizeOptions,
): UseElementSizeReturn
export function useElementSize(
  target: MaybeComputedElementRef,
  ...args: [options?: UseElementSizeOptions] | [initialSize: ElementSize | undefined, options?: UseElementSizeOptions]
): UseElementSizeReturn {
  const {
    initials: {
      width: initialWidth = 0,
      height: initialHeight = 0,
    } = {},
    ...options
  } = normalizeArgs(args)
  const { window = defaultWindow, box = 'content-box' } = options
  const isSVG = computed(() => unrefElement(target)?.namespaceURI?.includes('svg'))
  const width = shallowRef(initialWidth)
  const height = shallowRef(initialHeight)
  // snapshot, since a passed ref is overwritten by the measurements
  const fallbackWidth = toValue(initialWidth)
  const fallbackHeight = toValue(initialHeight)

  const { stop: stop1 } = useResizeObserver(
    target,
    ([entry]) => {
      const boxSize = box === 'border-box'
        ? entry.borderBoxSize
        : box === 'content-box'
          ? entry.contentBoxSize
          : entry.devicePixelContentBoxSize

      if (window && isSVG.value) {
        const $elem = unrefElement(target)
        if ($elem) {
          const rect = $elem.getBoundingClientRect()
          width.value = rect.width
          height.value = rect.height
        }
      }
      else {
        if (boxSize) {
          const formatBoxSize = toArray(boxSize)
          width.value = formatBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0)
          height.value = formatBoxSize.reduce((acc, { blockSize }) => acc + blockSize, 0)
        }
        else {
          // fallback
          width.value = entry.contentRect.width
          height.value = entry.contentRect.height
        }
      }
    },
    options,
  )

  function measure() {
    const ele = unrefElement(target)
    if (ele && 'offsetWidth' in ele) {
      if (box === 'content-box' && window) {
        const cs = window.getComputedStyle(ele)
        const padX = Number.parseFloat(cs.paddingLeft) + Number.parseFloat(cs.paddingRight)
        const padY = Number.parseFloat(cs.paddingTop) + Number.parseFloat(cs.paddingBottom)
        const bdX = Number.parseFloat(cs.borderLeftWidth) + Number.parseFloat(cs.borderRightWidth)
        const bdY = Number.parseFloat(cs.borderTopWidth) + Number.parseFloat(cs.borderBottomWidth)
        // hidden elements have no size but keep their padding and border
        width.value = Math.max(0, ele.offsetWidth - padX - bdX)
        height.value = Math.max(0, ele.offsetHeight - padY - bdY)
      }
      else {
        width.value = ele.offsetWidth
        height.value = ele.offsetHeight
      }
    }
    else if (ele) {
      width.value = fallbackWidth
      height.value = fallbackHeight
    }
  }

  tryOnMounted(measure)

  const stop2 = watch(
    () => unrefElement(target),
    (ele) => {
      if (ele) {
        measure()
      }
      else {
        width.value = 0
        height.value = 0
      }
    },
  )

  function stop() {
    stop1()
    stop2()
  }

  return {
    width: shallowReadonly(width),
    height: shallowReadonly(height),
    stop,
  }
}

function normalizeArgs(
  args: [options?: UseElementSizeOptions] | [initialSize: ElementSize | undefined, options?: UseElementSizeOptions],
): UseElementSizeOptions {
  const [first, second] = args
  const isDeprecatedCall = args.length > 1 || (first != null && ('width' in first || 'height' in first))
  if (!isDeprecatedCall)
    return (first ?? {}) as UseElementSizeOptions

  const initialSize = first as ElementSize | undefined
  const options = second ?? {}
  return {
    ...options,
    initials: {
      width: options.initials?.width ?? initialSize?.width,
      height: options.initials?.height ?? initialSize?.height,
    },
  }
}
