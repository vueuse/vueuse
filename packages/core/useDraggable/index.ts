import { computed, ref } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { isClient, resolveUnref, toRefs } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import type { PointerType, Position } from '../types'
import { defaultWindow } from '../_configurable'

export interface UseDraggableOptions {
  /**
   * Only start the dragging when click on the element directly
   *
   * @default false
   */
  exact?: MaybeComputedRef<boolean>

  /**
   * Prevent events defaults
   *
   * @default false
   */
  preventDefault?: MaybeComputedRef<boolean>

  /**
   * Prevent events propagation
   *
   * @default false
   */
  stopPropagation?: MaybeComputedRef<boolean>

  /**
   * Element to attach `pointermove` and `pointerup` events to.
   *
   * @default window
   */
  draggingElement?: MaybeComputedRef<HTMLElement | SVGElement | Window | Document | null | undefined>

  /**
   * Handle that triggers the drag event
   *
   * @default target
   */
  handle?: MaybeComputedRef<HTMLElement | SVGElement | null | undefined>

  /**
   * Pointer types that listen to.
   *
   * @default ['mouse', 'touch', 'pen']
   */
  pointerTypes?: PointerType[]

  /**
   * Initial position of the element.
   *
   * @default { x: 0, y: 0 }
   */
  initialValue?: MaybeComputedRef<Position>

  /**
   * Callback when the dragging starts. Return `false` to prevent dragging.
   */
  onStart?: (position: Position, event: PointerEvent) => void | false

  /**
   * Callback during dragging.
   */
  onMove?: (position: Position, event: PointerEvent) => void

  /**
   * Callback when dragging end.
   */
  onEnd?: (position: Position, event: PointerEvent) => void

  /**
   * Axis to drag on.
   */
  axis?: 'x' | 'y' | 'both'
}

/**
 * Make elements draggable.
 *
 * @see https://vueuse.org/useDraggable
 * @param target
 * @param options
 */
export function useDraggable(
  target: MaybeComputedRef<HTMLElement | SVGElement | null | undefined>,
  options: UseDraggableOptions = {},
) {
  const {
    pointerTypes,
    preventDefault,
    stopPropagation,
    exact,
    onMove,
    onEnd,
    onStart,
    initialValue,
    axis = 'both',
    draggingElement = defaultWindow,
    handle: draggingHandle = target,
  } = options

  const position = ref<Position>(
    resolveUnref(initialValue) ?? { x: 0, y: 0 },
  )

  const pressedDelta = ref<Position>()

  const filterEvent = (e: PointerEvent) => {
    if (pointerTypes)
      return pointerTypes.includes(e.pointerType as PointerType)
    return true
  }

  const handleEvent = (e: PointerEvent) => {
    if (resolveUnref(preventDefault))
      e.preventDefault()
    if (resolveUnref(stopPropagation))
      e.stopPropagation()
  }

  const start = (e: PointerEvent) => {
    if (!filterEvent(e))
      return
    if (resolveUnref(exact) && e.target !== resolveUnref(target))
      return
    const rect = resolveUnref(target)!.getBoundingClientRect()
    const pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    if (onStart?.(pos, e) === false)
      return
    pressedDelta.value = pos
    handleEvent(e)
  }
  const move = (e: PointerEvent) => {
    if (!filterEvent(e))
      return
    if (!pressedDelta.value)
      return

    let { x, y } = position.value
    if (axis === 'x' || axis === 'both')
      x = e.clientX - pressedDelta.value.x
    if (axis === 'y' || axis === 'both')
      y = e.clientY - pressedDelta.value.y
    position.value = {
      x,
      y,
    }
    onMove?.(position.value, e)
    handleEvent(e)
  }
  const end = (e: PointerEvent) => {
    if (!filterEvent(e))
      return
    if (!pressedDelta.value)
      return
    pressedDelta.value = undefined
    onEnd?.(position.value, e)
    handleEvent(e)
  }

  if (isClient) {
    useEventListener(draggingHandle, 'pointerdown', start, true)
    useEventListener(draggingElement, 'pointermove', move, true)
    useEventListener(draggingElement, 'pointerup', end, true)
  }

  return {
    ...toRefs(position),
    position,
    isDragging: computed(() => !!pressedDelta.value),
    style: computed(
      () => `left:${position.value.x}px;top:${position.value.y}px;`,
    ),
  }
}

export type UseDraggableReturn = ReturnType<typeof useDraggable>
