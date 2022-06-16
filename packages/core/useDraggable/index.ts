import type { Ref } from 'vue-demi'
import { computed, ref, unref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { isClient, toRefs } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import type { PointerType, Position } from '../types'
import { defaultWindow } from '../_configurable'

export interface UseDraggableOptions {
  /**
   * Only start the dragging when click on the element directly
   *
   * @default false
   */
  exact?: MaybeRef<boolean>

  /**
   * Prevent events defaults
   *
   * @default false
   */
  preventDefault?: MaybeRef<boolean>

  /**
   * Prevent events propagation
   *
   * @default false
   */
  stopPropagation?: MaybeRef<boolean>

  /**
   * Element to attach `pointermove` and `pointerup` events to.
   *
   * @default window
   */
  draggingElement?: MaybeRef<HTMLElement | SVGElement | Window | Document | null | undefined>

  /**
   * Pointer types that listen to.
   *
   * @default ['mouse', 'touch', 'pen']
   */
  pointerTypes?: PointerType[]

  /**
   * Initial position of the element.
   *
   * @default { x: 0, y: 0}
   */
  initialValue?: MaybeRef<Position>

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
}

/**
 * Make elements draggable.
 *
 * @see https://vueuse.org/useDraggable
 * @param target
 * @param options
 */
export function useDraggable(target: MaybeRef<HTMLElement | SVGElement | null | undefined>, options: UseDraggableOptions = {}) {
  const draggingElement = options.draggingElement ?? defaultWindow
  const position: Ref<Position> = ref(options.initialValue ?? { x: 0, y: 0 })
  const pressedDelta = ref<Position>()

  const filterEvent = (e: PointerEvent) => {
    if (options.pointerTypes)
      return options.pointerTypes.includes(e.pointerType as PointerType)
    return true
  }

  const handleEvent = (e: PointerEvent) => {
    if (unref(options.preventDefault))
      e.preventDefault()
    if (unref(options.stopPropagation))
      e.stopPropagation()
  }

  const start = (e: PointerEvent) => {
    if (!filterEvent(e))
      return
    if (unref(options.exact) && e.target !== unref(target))
      return
    const rect = unref(target)!.getBoundingClientRect()
    const pos = {
      x: e.pageX - rect.left,
      y: e.pageY - rect.top,
    }
    if (options.onStart?.(pos, e) === false)
      return
    pressedDelta.value = pos
    handleEvent(e)
  }
  const move = (e: PointerEvent) => {
    if (!filterEvent(e))
      return
    if (!pressedDelta.value)
      return
    position.value = {
      x: e.pageX - pressedDelta.value.x,
      y: e.pageY - pressedDelta.value.y,
    }
    options.onMove?.(position.value, e)
    handleEvent(e)
  }
  const end = (e: PointerEvent) => {
    if (!filterEvent(e))
      return
    if (!pressedDelta.value)
      return
    pressedDelta.value = undefined
    options.onEnd?.(position.value, e)
    handleEvent(e)
  }

  if (isClient) {
    useEventListener(target, 'pointerdown', start, true)
    useEventListener(draggingElement, 'pointermove', move, true)
    useEventListener(draggingElement, 'pointerup', end, true)
  }

  return {
    ...toRefs(position),
    position,
    isDragging: computed(() => !!pressedDelta.value),
    style: computed(() => `left:${position.value.x}px;top:${position.value.y}px;`),
  }
}
