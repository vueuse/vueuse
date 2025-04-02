import type { MaybeRefOrGetter } from '@vueuse/shared'
import type { PointerType, Position } from '../types'
import { isClient, toRefs } from '@vueuse/shared'
import { computed, ref, toValue, watch } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

export interface UseDraggableOptions {
  /**
   * Only start the dragging when click on the element directly
   *
   * @default false
   */
  exact?: MaybeRefOrGetter<boolean>

  /**
   * Prevent events defaults
   *
   * @default false
   */
  preventDefault?: MaybeRefOrGetter<boolean>

  /**
   * Prevent events propagation
   *
   * @default false
   */
  stopPropagation?: MaybeRefOrGetter<boolean>

  /**
   * Whether dispatch events in capturing phase
   *
   * @default true
   */
  capture?: boolean

  /**
   * Element to attach `pointermove` and `pointerup` events to.
   *
   * @default window
   */
  draggingElement?: MaybeRefOrGetter<HTMLElement | SVGElement | Window | Document | null | undefined>

  /**
   * Element for calculating bounds (If not set, it will use the event's target).
   *
   * @default undefined
   */
  containerElement?: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>

  /**
   * Handle that triggers the drag event
   *
   * @default target
   */
  handle?: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>

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
  initialValue?: MaybeRefOrGetter<Position>

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
   *
   * @default 'both'
   */
  axis?: 'x' | 'y' | 'both'

  /**
   * Disabled drag and drop.
   *
   * @default false
   */
  disabled?: MaybeRefOrGetter<boolean>

  /**
   * Mouse buttons that are allowed to trigger drag events.
   *
   * - `0`: Main button, usually the left button or the un-initialized state
   * - `1`: Auxiliary button, usually the wheel button or the middle button (if present)
   * - `2`: Secondary button, usually the right button
   * - `3`: Fourth button, typically the Browser Back button
   * - `4`: Fifth button, typically the Browser Forward button
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button#value
   * @default [0]
   */
  buttons?: MaybeRefOrGetter<number[]>

  /**
   * Whether to restrict dragging within the visible area of the container.
   *
   * If enabled, the draggable element will not leave the visible area of its container,
   * ensuring it remains within the viewport of the container during the drag.
   *
   * @default false
   */
  restrictInView?: MaybeRefOrGetter<boolean>

  /**
   * Whether to enable auto-scroll when dragging near the edges.
   *
   * @default false
   */
  autoScroll?: MaybeRefOrGetter<boolean | {
    /**
     * Speed of auto-scroll.
     *
     * @default 2
     */
    speed?: MaybeRefOrGetter<number | Position>

    /**
     * Margin from the edge to trigger auto-scroll.
     *
     * @default 30
     */
    margin?: MaybeRefOrGetter<number | Position>

    /**
     * Direction of auto-scroll.
     *
     * @default 'both'
     */
    direction?: 'x' | 'y' | 'both'
  }>
}

const defaultScrollConfig = { speed: 2, margin: 30, direction: 'both' }

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
    containerElement,
    handle: draggingHandle = target,
    buttons = [0],
    restrictInView,
    autoScroll = false,
  } = options

  const position = ref<Position>(
    toValue(initialValue) ?? { x: 0, y: 0 },
  )

  const pressedDelta = ref<Position>()

  const filterEvent = (e: PointerEvent) => {
    if (pointerTypes)
      return pointerTypes.includes(e.pointerType as PointerType)
    return true
  }

  const handleEvent = (e: PointerEvent) => {
    if (toValue(preventDefault))
      e.preventDefault()
    if (toValue(stopPropagation))
      e.stopPropagation()
  }

  const scrollConfig = toValue(autoScroll)
  const scrollSettings = typeof scrollConfig === 'object'
    ? {
        speed: toValue(scrollConfig.speed) ?? defaultScrollConfig.speed,
        margin: toValue(scrollConfig.margin) ?? defaultScrollConfig.margin,
        direction: scrollConfig.direction ?? defaultScrollConfig.direction,
      }
    : defaultScrollConfig

  const getScrollAxisValues = (value: number | Position): [number, number] =>
    typeof value === 'number' ? [value, value] : [value.x, value.y]

  const handleAutoScroll = (
    container: HTMLElement | SVGElement,
    targetRect: DOMRect,
    position: Position,
  ) => {
    const { clientWidth, clientHeight } = container

    const [marginX, marginY] = getScrollAxisValues(scrollSettings.margin)
    const [speedX, speedY] = getScrollAxisValues(scrollSettings.speed)

    let deltaX = 0
    let deltaY = 0

    if (scrollSettings.direction === 'x' || scrollSettings.direction === 'both') {
      if (position.x <= marginX)
        deltaX = -speedX
      else if (position.x + targetRect.width >= clientWidth - marginX)
        deltaX = speedX
    }

    if (scrollSettings.direction === 'y' || scrollSettings.direction === 'both') {
      if (position.y <= marginY)
        deltaY = -speedY
      else if (position.y + targetRect.height >= clientHeight - marginY)
        deltaY = speedY
    }

    if (deltaX || deltaY) {
      container.scrollBy({ left: deltaX, top: deltaY, behavior: 'auto' })
    }
  }

  let autoScrollInterval: ReturnType<typeof setInterval> | null = null
  const startAutoScroll = () => {
    const container = toValue(containerElement)
    if (container && !autoScrollInterval) {
      autoScrollInterval = setInterval(() => {
        const targetRect = toValue(target)!.getBoundingClientRect()
        const { x, y } = position.value
        let adjustedX = x - container.scrollLeft
        let adjustedY = y - container.scrollTop
        if (adjustedX >= 0 && adjustedY >= 0) {
          handleAutoScroll(
            container,
            targetRect,
            { x: adjustedX, y: adjustedY },
          )
          adjustedX += container.scrollLeft
          adjustedY += container.scrollTop
          position.value = {
            x: adjustedX,
            y: adjustedY,
          }
        }
      }, 1000 / 60)
    }
  }
  const stopAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval)
      autoScrollInterval = null
    }
  }
  const checkAutoScroll = () => {
    if (toValue(options.disabled) || !pressedDelta.value)
      return
    const container = toValue(containerElement)
    if (!container)
      return

    const isInScrollableArea
      = (container.scrollLeft > 0
        && container.scrollLeft + 1
        < container.scrollWidth - container.clientWidth)
      || (container.scrollTop > 0
        && container.scrollTop + 1
        < container.scrollHeight - container.clientHeight)

    if (isInScrollableArea)
      startAutoScroll()
    else stopAutoScroll()
  }

  if (toValue(autoScroll)) {
    watch(position, checkAutoScroll)
  }

  const start = (e: PointerEvent) => {
    if (!toValue(buttons).includes(e.button))
      return
    if (toValue(options.disabled) || !filterEvent(e))
      return
    if (toValue(exact) && e.target !== toValue(target))
      return

    const container = toValue(containerElement)
    const containerRect = container?.getBoundingClientRect?.()
    const targetRect = toValue(target)!.getBoundingClientRect()
    const pos = {
      x: e.clientX - (container ? targetRect.left - containerRect!.left + (autoScroll ? 0 : container.scrollLeft) : targetRect.left),
      y: e.clientY - (container ? targetRect.top - containerRect!.top + (autoScroll ? 0 : container.scrollTop) : targetRect.top),
    }
    if (onStart?.(pos, e) === false)
      return
    pressedDelta.value = pos
    handleEvent(e)
  }
  const move = (e: PointerEvent) => {
    if (toValue(options.disabled) || !filterEvent(e))
      return
    if (!pressedDelta.value)
      return

    const container = toValue(containerElement)
    const targetRect = toValue(target)!.getBoundingClientRect()
    let { x, y } = position.value
    if (axis === 'x' || axis === 'both') {
      x = e.clientX - pressedDelta.value.x
      if (container)
        x = Math.min(Math.max(0, x), container.scrollWidth - targetRect!.width)
    }
    if (axis === 'y' || axis === 'both') {
      y = e.clientY - pressedDelta.value.y
      if (container)
        y = Math.min(Math.max(0, y), container.scrollHeight - targetRect!.height)
    }

    if (toValue(autoScroll) && container) {
      if (autoScrollInterval === null)
        handleAutoScroll(container, targetRect, { x, y })

      x += container.scrollLeft
      y += container.scrollTop
    }

    if (container && (restrictInView || autoScroll)) {
      if (axis !== 'y') {
        const offsetX = x - container.scrollLeft
        if (offsetX < 0)
          x = container.scrollLeft
        else if (offsetX > container.clientWidth - targetRect.width)
          x = container.clientWidth - targetRect.width + container.scrollLeft
      }
      if (axis !== 'x') {
        const offsetY = y - container.scrollTop
        if (offsetY < 0)
          y = container.scrollTop
        else if (offsetY > container.clientHeight - targetRect.height)
          y = container.clientHeight - targetRect.height + container.scrollTop
      }
    }

    position.value = {
      x,
      y,
    }
    onMove?.(position.value, e)
    handleEvent(e)
  }
  const end = (e: PointerEvent) => {
    if (toValue(options.disabled) || !filterEvent(e))
      return
    if (!pressedDelta.value)
      return
    pressedDelta.value = undefined
    if (autoScroll)
      stopAutoScroll()
    onEnd?.(position.value, e)
    handleEvent(e)
  }

  if (isClient) {
    const config = { capture: options.capture ?? true }
    useEventListener(draggingHandle, 'pointerdown', start, config)
    useEventListener(draggingElement, 'pointermove', move, config)
    useEventListener(draggingElement, 'pointerup', end, config)
  }

  return {
    ...toRefs(position),
    position,
    isDragging: computed(() => !!pressedDelta.value),
    style: computed(() => `
      left: ${position.value.x}px;
      top: ${position.value.y}px;
      ${autoScroll ? 'text-wrap: nowrap;' : ''}
    `),
  }
}

export type UseDraggableReturn = ReturnType<typeof useDraggable>
