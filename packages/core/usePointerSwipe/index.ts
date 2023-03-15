import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveRef } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { computed, reactive, readonly, ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import type { PointerType, Position } from '../types'
import type { UseSwipeDirection } from '../useSwipe'

export interface UsePointerSwipeOptions {
  /**
   * @default 50
   */
  threshold?: number

  /**
   * Callback on swipe start.
   */
  onSwipeStart?: (e: PointerEvent) => void

  /**
   * Callback on swipe move.
   */
  onSwipe?: (e: PointerEvent) => void

  /**
   * Callback on swipe end.
   */
  onSwipeEnd?: (e: PointerEvent, direction: UseSwipeDirection) => void

  /**
   * Pointer types to listen to.
   *
   * @default ['mouse', 'touch', 'pen']
   */
  pointerTypes?: PointerType[]
}

export interface UsePointerSwipeReturn {
  readonly isSwiping: Ref<boolean>
  direction: Readonly<Ref<UseSwipeDirection>>
  readonly posStart: Position
  readonly posEnd: Position
  distanceX: Readonly<Ref<number>>
  distanceY: Readonly<Ref<number>>
  stop: () => void
}

/**
 * Reactive swipe detection based on PointerEvents.
 *
 * @see https://vueuse.org/usePointerSwipe
 * @param target
 * @param options
 */
export function usePointerSwipe(
  target: MaybeComputedRef<HTMLElement | null | undefined>,
  options: UsePointerSwipeOptions = {},
): UsePointerSwipeReturn {
  const targetRef = resolveRef(target)
  const {
    threshold = 50,
    onSwipe,
    onSwipeEnd,
    onSwipeStart,
  } = options

  const posStart = reactive<Position>({ x: 0, y: 0 })
  const updatePosStart = (x: number, y: number) => {
    posStart.x = x
    posStart.y = y
  }

  const posEnd = reactive<Position>({ x: 0, y: 0 })
  const updatePosEnd = (x: number, y: number) => {
    posEnd.x = x
    posEnd.y = y
  }

  const distanceX = computed(() => posStart.x - posEnd.x)
  const distanceY = computed(() => posStart.y - posEnd.y)

  const { max, abs } = Math
  const isThresholdExceeded = computed(() => max(abs(distanceX.value), abs(distanceY.value)) >= threshold)
  const isSwiping = ref(false)
  const isPointerDown = ref(false)

  const direction = computed(() => {
    if (!isThresholdExceeded.value)
      return 'none'

    if (abs(distanceX.value) > abs(distanceY.value)) {
      return distanceX.value > 0
        ? 'left'
        : 'right'
    }
    else {
      return distanceY.value > 0
        ? 'up'
        : 'down'
    }
  })

  const eventIsAllowed = (e: PointerEvent): boolean => {
    const isReleasingButton = e.buttons === 0
    const isPrimaryButton = e.buttons === 1
    return options.pointerTypes?.includes(e.pointerType as PointerType) ?? (isReleasingButton || isPrimaryButton) ?? true
  }

  const stops = [
    useEventListener(target, 'pointerdown', (e: PointerEvent) => {
      if (!eventIsAllowed(e))
        return
      isPointerDown.value = true
      // Disable scroll on for TouchEvents
      targetRef.value?.style?.setProperty('touch-action', 'none')
      // Future pointer events will be retargeted to target until pointerup/cancel
      const eventTarget = e.target as HTMLElement | undefined
      eventTarget?.setPointerCapture(e.pointerId)
      const { clientX: x, clientY: y } = e
      updatePosStart(x, y)
      updatePosEnd(x, y)
      onSwipeStart?.(e)
    }),

    useEventListener(target, 'pointermove', (e: PointerEvent) => {
      if (!eventIsAllowed(e))
        return
      if (!isPointerDown.value)
        return

      const { clientX: x, clientY: y } = e
      updatePosEnd(x, y)
      if (!isSwiping.value && isThresholdExceeded.value)
        isSwiping.value = true
      if (isSwiping.value)
        onSwipe?.(e)
    }),

    useEventListener(target, 'pointerup', (e: PointerEvent) => {
      if (!eventIsAllowed(e))
        return
      if (isSwiping.value)
        onSwipeEnd?.(e, direction.value)

      isPointerDown.value = false
      isSwiping.value = false
      targetRef.value?.style?.setProperty('touch-action', 'initial')
    }),
  ]

  const stop = () => stops.forEach(s => s())

  return {
    isSwiping: readonly(isSwiping),
    direction: readonly(direction),
    posStart: readonly(posStart),
    posEnd: readonly(posEnd),
    distanceX,
    distanceY,
    stop,
  }
}
