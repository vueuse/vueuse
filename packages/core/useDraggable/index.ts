import { Ref, ref, unref, computed } from 'vue-demi'
import { MaybeRef, toRefs, isClient } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import { MaybeElementRef } from '../unrefElement'
import { PointerType, Position } from '../types'
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
   * Element to attach `pointermove` and `pointerup` events to.
   *
   * @default window
   */
  draggingElement?: MaybeElementRef

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
}

/**
 * Make elements draggable.
 *
 * @see https://vueuse.org/useDraggable
 * @param el
 * @param options
 */
export function useDraggable(el: MaybeElementRef, options: UseDraggableOptions = {}) {
  const draggingElement = options.draggingElement ?? defaultWindow
  const position: Ref<Position> = ref(options.initialValue ?? { x: 0, y: 0 })
  const pressedDelta = ref<Position>()

  const filterEvent = (e: PointerEvent) => {
    if (options.pointerTypes)
      return options.pointerTypes.includes(e.pointerType as PointerType)
    return true
  }
  const preventDefault = (e: PointerEvent) => {
    if (unref(options.preventDefault))
      e.preventDefault()
  }
  const start = (e: PointerEvent) => {
    if (!filterEvent(e))
      return
    if (unref(options.exact) && e.target !== el.value)
      return
    const react = el.value!.getBoundingClientRect()
    const pos = {
      x: e.pageX - react.left,
      y: e.pageY - react.top,
    }
    if (options.onStart?.(pos, e) === false)
      return
    pressedDelta.value = pos
    preventDefault(e)
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
    preventDefault(e)
  }
  const end = (e: PointerEvent) => {
    if (!filterEvent(e))
      return
    pressedDelta.value = undefined
    preventDefault(e)
  }

  if (isClient) {
    useEventListener(el, 'pointerdown', start, true)
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
