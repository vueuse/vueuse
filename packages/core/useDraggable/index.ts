import type { MaybeRefOrGetter } from '@vueuse/shared'
import { isClient, toRefs, toValue } from '@vueuse/shared'
import { computed, ref } from 'vue-demi'
import { defaultWindow } from '../_configurable'
import type { PointerType, Position } from '../types'
import { useEventListener } from '../useEventListener'

export interface ActiveCallback {
  (state: Position, evt: PointerEvent): false | void
}

export interface PassiveCallback {
  (state: Position, evt: PointerEvent): any
}

export type Axis = 'both' | 'x' | 'y'

export interface UseDraggableOptions {
  /**
   * Axis to drag on.
   *
   * @default 'both'
   */
  axis?: Axis

  /**
   * Whether dispatch events in capturing phase.
   *
   * @default true
   */
  capture?: boolean

  /**
   * Element to attach `pointermove` and `pointerup` events to.
   *
   * @default window
   */
  draggingElement?: MaybeRefOrGetter<
    Document | HTMLElement | SVGElement | Window | null | undefined
  >

  /**
   * Only start the dragging when click on the element directly.
   *
   * @default false
   */
  exact?: MaybeRefOrGetter<boolean>

  /**
   * Handle that triggers the drag event.
   *
   * @default target
   */
  handle?: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>

  /**
   * Initial position of the element.
   *
   * @default { x: 0, y: 0 }
   */
  initialValue?: MaybeRefOrGetter<Position>

  /**
   * Callback when dragging end.
   */
  onEnd?: PassiveCallback

  /**
   * Callback during dragging.
   */
  onMove?: PassiveCallback

  /**
   * Callback when the dragging starts. Return `false` to prevent dragging.
   */
  onStart?: ActiveCallback

  /**
   * Pointer types that listen to.
   *
   * @default ['mouse', 'pen', 'touch']
   */
  pointerTypes?: PointerType[]

  /**
   * Prevent events defaults.
   *
   * @default false
   */
  preventDefault?: MaybeRefOrGetter<boolean>

  /**
   * Prevent events propagation.
   *
   * @default false
   */
  stopPropagation?: MaybeRefOrGetter<boolean>
}

function vecSub(v: Position, w: Position) {
  return { x: v.x - w.x, y: v.y - w.y }
}
function isXAxis(axis: Axis) {
  return axis === 'both' || axis === 'x'
}
function isYAxis(axis: Axis) {
  return axis === 'both' || axis === 'y'
}

/**
 * Make elements draggable.
 *
 * @see https://vueuse.org/useDraggable
 * @param target
 * @param options
 */
export function useDraggable(
  target: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>,
  options: UseDraggableOptions = {},
) {
  const {
    capture,
    exact,
    initialValue,
    onEnd,
    onMove,
    onStart,
    pointerTypes,
    preventDefault,
    stopPropagation,
    axis = 'both',
    draggingElement: container = defaultWindow,
    handle = target,
  } = options

  const position = ref<Position>(toValue(initialValue) ?? { x: 0, y: 0 })
  const startEvent = ref<PointerEvent | null>(null)
  const history: PointerEvent[] = []

  const hitTest = (ev: PointerEvent) =>
    toValue(exact) ? ev.target === toValue(target) : true

  const isDragStarted = () => startEvent.value != null

  const isTypeSupported = (ev: PointerEvent) =>
    pointerTypes?.includes(ev.pointerType as PointerType) !== false

  const shouldStartDrag = (ev: PointerEvent) =>
    onStart?.(toValue(position), ev) !== false

  const onPointerDown = (ev: PointerEvent) => {
    if (hitTest(ev) && shouldStartDrag(ev)) {
      history.push(ev)
      startEvent.value = ev
    }
  }

  const onPointerMove = (ev: PointerEvent) => {
    if (!isDragStarted())
      return

    const delta = vecSub(ev, history.at(-1)!)
    const x = position.value.x + (isXAxis(axis) ? delta.x : 0)
    const y = position.value.y + (isYAxis(axis) ? delta.y : 0)

    position.value = { x, y }
    history.push(ev)
    onMove?.(toValue(position), ev)
  }

  const onPointerUp = (ev: PointerEvent) => {
    history.length = 0

    if (!isDragStarted())
      return

    startEvent.value = null
    onEnd?.(toValue(position), ev)
  }

  const handleEvent = (ev: PointerEvent) => {
    if (!isTypeSupported(ev))
      return

    if (toValue(preventDefault))
      ev.preventDefault()

    if (toValue(stopPropagation))
      ev.stopPropagation()

    switch (ev.type) {
      case 'pointerdown':
        onPointerDown(ev)
        break
      case 'pointermove':
        onPointerMove(ev)
        break
      case 'pointercancel':
      case 'pointerup':
        onPointerUp(ev)
        break
      default:
        break
    }
  }

  if (isClient) {
    const addEventListenerOptions = { capture }
    useEventListener(
      handle,
      'pointerdown',
      handleEvent,
      addEventListenerOptions,
    )

    useEventListener(
      container,
      'pointermove',
      handleEvent,
      addEventListenerOptions,
    )

    useEventListener(
      container,
      'pointercancel',
      handleEvent,
      addEventListenerOptions,
    )

    useEventListener(
      container,
      'pointerup',
      handleEvent,
      addEventListenerOptions,
    )
  }
  const isDragging = computed(isDragStarted)
  const style = computed(
    () => `left: ${position.value.x}px; top: ${position.value.y}px;`,
  )

  return { ...toRefs(position), isDragging, position, style }
}

export type UseDraggableReturn = ReturnType<typeof useDraggable>
