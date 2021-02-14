import { onMounted } from 'vue-demi'
import { noop } from './../../shared/utils/is'

import { computed, onBeforeUnmount, ref, unref, watch } from 'vue'
import { MaybeRef } from '..'

export enum SwipeDirection {
  UP = 'UP', RIGHT = 'RIGHT', DOWN = 'DOWN', LEFT = 'LEFT'
}

/**
 * Reactive swipe detection.
 *
 * @see {@link https://vueuse.js.org/useSwipe}
 * @param target
 * @param options
 */
export function useSwipe(
  target: MaybeRef<HTMLElement | null | undefined>,
  options?: {
    threshold?: number
    onSwipe?: (e: TouchEvent) => void
    onSwipeEnd?: (e: TouchEvent, direction: SwipeDirection) => void
  },
) {
  const targetRef = ref(target)
  const { threshold, onSwipe, onSwipeEnd } = options || {}

  const coordsStart = ref([0, 0])
  const coordsEnd = ref([0, 0])

  const diffX = computed(() => coordsStart.value[0] - coordsEnd.value[0])
  const diffY = computed(() => coordsStart.value[1] - coordsEnd.value[1])

  const isThresholdExeeded = computed(() => Math.max(Math.abs(diffX.value), Math.abs(diffY.value)) >= (threshold || 0))

  const isSwiping = ref(false)

  const direction = computed(() => {
    if (isThresholdExeeded.value) {
      if (Math.abs(diffX.value) > Math.abs(diffY.value)) {
        if (diffX.value > 0) return SwipeDirection.LEFT
        return SwipeDirection.RIGHT
      }
      else {
        if (diffY.value > 0) return SwipeDirection.UP
        else return SwipeDirection.DOWN
      }
    }
    else {
      return null
    }
  })

  const getTouchEventCoords = (e: TouchEvent) => [e.touches[0].clientX, e.touches[0].clientY]

  const onTouchStart = (e: TouchEvent) => {
    coordsStart.value = getTouchEventCoords(e)
    coordsEnd.value = coordsStart.value
  }

  const onTouchMove = (e: TouchEvent) => {
    isSwiping.value = true
    coordsEnd.value = getTouchEventCoords(e)
    if (direction.value && onSwipe) onSwipe(e)
    else e.preventDefault()
  }

  const onTouchEnd = (e: TouchEvent) => {
    isSwiping.value = false
    if (direction.value)
      onSwipeEnd?.(e, direction.value)
  }

  const addListeners = (el: HTMLElement | undefined | null) => {
    if (!el) return
    el.addEventListener('touchstart', onTouchStart, { capture: true })
    el.addEventListener('touchmove', onTouchMove, { capture: false })
    el.addEventListener('touchend', onTouchEnd, { capture: true })
  }

  onMounted(() => addListeners(targetRef.value))

  const removeListeners = (el: HTMLElement | undefined | null) => {
    if (!el) return
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchmove', onTouchMove)
    el.removeEventListener('touchend', onTouchEnd)
  }

  onBeforeUnmount(() => removeListeners(targetRef.value))

  let cleanup = noop

  watch(
    () => unref(targetRef),
    (el) => {
      cleanup()
      if (!el)
        return

      addListeners(el)

      cleanup = () => {
        removeListeners(el)
        cleanup = noop
      }
    },
    { immediate: true },
  )

  return {
    isSwiping,
    direction,
    lengthX: computed(() => Math.ceil(diffX.value)),
    lengthY: computed(() => Math.ceil(diffY.value)),
  }
}
