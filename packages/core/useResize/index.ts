/* eslint-disable curly */
import { watch, ref, reactive, unref, nextTick, computed } from 'vue-demi'
import { useEventListener, useResizeObserver } from '@vueuse/core'
import { createEventHook, Fn, tryOnScopeDispose, MaybeRef } from '@vueuse/shared'
import { MaybeElementRef, unrefElement } from '../unrefElement'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

type Edges = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | 'top' | 'bottom'

export interface UseResizeOptions extends ConfigurableWindow {
  disabled?: boolean
  disableResize?: MaybeRef<boolean>
  disableCursor?: MaybeRef<boolean>
  xMultiplier?: MaybeRef<number>
  yMultiplier?: MaybeRef<number>
  borderRadius?: MaybeRef<number>
  minWidth?: MaybeRef<number> | 'initial'
  maxWidth?: MaybeRef<number> | 'initial'
  minHeight?: MaybeRef<number> | 'initial'
  maxHeight?: MaybeRef<number> | 'initial'
  edges?: MaybeRef<Edges[]>
}

const container = ref<MaybeElementRef[]>([])

export function useResize(element: MaybeElementRef, options: UseResizeOptions = {}) {
  const {
    window = defaultWindow,
    disabled = false,
    disableResize = false,
    disableCursor = false,
    xMultiplier = 1,
    yMultiplier = 1,
    borderRadius = 0,
    edges = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'left', 'right', 'top', 'bottom'],
  } = options
  let {
    minWidth = 1,
    maxWidth = Infinity,
    minHeight = 1,
    maxHeight = Infinity,
  } = options

  const isActive = ref(disabled)
  const target = computed(() => unrefElement(element))

  let width = 0
  let height = 0

  const onResizeStart = createEventHook<{ pointer: PointerEvent }>()
  const onResizeEnd = createEventHook<{ pointer: PointerEvent }>()
  const onResizeMove = createEventHook<{
    pointer: PointerEvent
    xDiff: number
    yDiff: number
    startX: number
    startY: number
    newWidth: number
    newHeight: number
    minHeight: number
    minWidth: number
    maxHeight: number
    maxWidth: number
  }>()

  const isOutside = ref(false)
  const isOverEdge = ref(false)
  const isResizing = ref(false)
  const isPathIncludesTarget = ref(false)
  const direction = ref('')
  const style = ref('')
  const leftStart = ref(0)
  const topStart = ref(0)
  const leftStartMax = ref(0)
  const topStartMax = ref(0)
  const leftStartMin = ref(0)
  const topStartMin = ref(0)

  const pointer = reactive({ startX: 0, startY: 0, currentX: 0, currentY: 0 })

  const widthRef = ref(0)
  const heightRef = ref(0)

  let cleanup: Fn[] = []

  const start = () => {
    cleanup.push(
      useEventListener(window, 'pointerdown', onPointerDown),
      useEventListener(window, 'pointerup', onPointerUp),
      useEventListener(window, 'pointercancel', onPointerUp),
      useEventListener(window, 'lostpointercapture', onPointerUp),
      useEventListener(window, 'pointermove', onPointerMove),
      watch(pointer, handlePointer),
    )
    isActive.value = true
  }

  const stop = () => {
    cleanup.forEach(fn => fn())
    cleanup = []
    container.value = []
    isActive.value = false
    isResizing.value = false
    window!.document.body.style.setProperty('cursor', '')
  }
  const targetIsVisible = ref(false)
  useResizeObserver(target, () => {
    targetIsVisible.value = !!target.value!.getBoundingClientRect().width
  })

  watch(target, (value) => {
    if (value) {
      start()
      ;({ width, height } = value.getBoundingClientRect())
      if (minWidth === 'initial') minWidth = width
      if (minHeight === 'initial') minHeight = height
      if (maxWidth === 'initial') maxWidth = width
      if (maxHeight === 'initial') maxHeight = height

      // dont set widthheight if element is not visible
      // set width height when element comes visible
      if (!width)
        return

      widthRef.value = width
      heightRef.value = height
      style.value = `width:${clamp(width, unref(minWidth as number), unref(maxWidth as number))}px;height:${clamp(height, unref(minHeight as number), unref(maxHeight as number))}px;`

      if (!unref(disableResize))
        target.value!.setAttribute('style', style.value)
    }
    else {
      stop()
    }
  })

  const setCursorAndDirection = (setCursor = '', setDirection = '', setTouchAction = 'none') => {
    if (setDirection && !container.value.includes(target.value)) {
      container.value.push(target.value)
    }
    if (container.value[0] === target.value) {
      direction.value = setDirection
      isOverEdge.value = !!setDirection
      !disableCursor && window!.document.body.style.setProperty('cursor', setCursor)
      window!.document.body.style.setProperty('touch-action', setTouchAction)
      window!.document.body.style.setProperty('user-select', setTouchAction)
    }
    if (!setDirection && container.value.includes(target.value)) {
      container.value.splice(container.value.indexOf(target.value), 1)
    }
  }

  async function onPointerUp(evt: PointerEvent) {
    isOutside.value = false

    if (!isOverEdge.value)
      return

    isResizing.value = false

    if (evt.pointerType === 'touch')
      setCursorAndDirection('', '', '')

    onResizeEnd.trigger({ pointer: evt })
    evt.preventDefault()
  }

  let scale = 1
  function onPointerMove(evt: PointerEvent) {
    isPathIncludesTarget.value = (evt.composedPath() as Element[]).includes(target.value!)

    pointer.currentX = evt.x
    pointer.currentY = evt.y

    if (evt.pressure === 0 && !evt.movementX && !evt.movementY)
      handlePointer(pointer)

    if (!isOverEdge.value || !isResizing.value)
      return

    let newWidth = width / scale
    let newHeight = height / scale

    const xDiff = Math.abs(evt.x - pointer.startX) * unref(xMultiplier)
    const yDiff = Math.abs(evt.y - pointer.startY) * unref(yMultiplier)

    if (direction.value.includes('bottom'))
      newHeight += (evt.y > pointer.startY ? Math.abs(yDiff) : -Math.abs(yDiff))

    if (direction.value.includes('top'))
      newHeight += (evt.y > pointer.startY ? -Math.abs(yDiff) : Math.abs(yDiff))

    if (direction.value.includes('left'))
      newWidth += (evt.x > pointer.startX ? -Math.abs(xDiff) : Math.abs(xDiff))

    if (direction.value.includes('right'))
      newWidth += (evt.x > pointer.startX ? Math.abs(xDiff) : -Math.abs(xDiff))

    const { left, top } = target.value!.getBoundingClientRect()

    widthRef.value = clamp(newWidth, unref(minWidth as number), unref(maxWidth as number))
    heightRef.value = clamp(newHeight, unref(minHeight as number), unref(maxHeight as number))

    style.value = `${getComputedStyle(target.value!).position === 'fixed'
      ? `transform:translate(${direction.value.includes('left')
        ? clamp(leftStart.value + xDiff, leftStartMin.value, leftStartMax.value)
        : left}px,${direction.value.includes('top')
        ? clamp(topStart.value + yDiff, topStartMin.value, topStartMax.value)
        : top}px);`
      : ''}width:${clamp(newWidth, unref(minWidth as number), unref(maxWidth as number))}px;height:${clamp(newHeight, unref(minHeight as number), unref(maxHeight as number))}px;`

    if (!unref(disableResize))
      target.value!.setAttribute('style', style.value)

    onResizeMove.trigger({
      pointer: evt,
      xDiff,
      yDiff,
      startX: pointer.startX,
      startY: pointer.startY,
      newWidth: clamp(newWidth, unref(minWidth as number), unref(maxWidth as number)),
      newHeight: clamp(newHeight, unref(minHeight as number), unref(maxHeight as number)),
      minHeight: Number(minHeight),
      minWidth: Number(minWidth),
      maxHeight: Number(maxHeight),
      maxWidth: Number(maxWidth),
    })
    evt.preventDefault()
  }

  async function onPointerDown(evt: PointerEvent) {
    if (evt.pointerType === 'touch') {
      pointer.currentX = evt.x
      pointer.currentY = evt.y
      isPathIncludesTarget.value = (evt.composedPath() as Element[]).includes(target.value!)
      await nextTick()
    }
    if (isOverEdge.value || (isOverEdge.value && evt.pointerType === 'touch')) {
      scale = Number((+target.value!.style.getPropertyValue('transform').replace('scale(', '').replace(')', '') || 1).toFixed(2));
      ({ width, height } = target.value!.getBoundingClientRect())
      leftStart.value = target.value!.getBoundingClientRect().left
      topStart.value = target.value!.getBoundingClientRect().top
      leftStartMax.value = (target.value!.getBoundingClientRect().width - Number(unref(minWidth))) + target.value!.getBoundingClientRect().left
      topStartMax.value = (target.value!.getBoundingClientRect().height - Number(unref(minHeight))) + target.value!.getBoundingClientRect().top
      leftStartMin.value = target.value!.getBoundingClientRect().left - (Number(unref(maxWidth)) - target.value!.getBoundingClientRect().width)
      topStartMin.value = target.value!.getBoundingClientRect().top - (Number(unref(maxHeight)) - target.value!.getBoundingClientRect().height)
      isResizing.value = true
      pointer.startY = evt.y
      pointer.startX = evt.x
      onResizeStart.trigger({ pointer: evt })
      evt.preventDefault()
    }
    else {
      isOutside.value = true
    }
  }

  const isOnForeground = (x: number, y: number, corner = false, xReduce?: number, yReduce?: number) => {
    const getCorner = (xA: number, yA: number) => {
      let found = false
      while (!found && Math.abs(xA - x) < unref(borderRadius) / 2) {
        xA += xReduce!
        yA += yReduce!
        found = target.value!.contains(window!.document.elementFromPoint(xA, yA)) || window!.document.elementFromPoint(xA, yA) === target.value!
      }
      return found
    }
    const element = window!.document.elementFromPoint(x, y)
    return isPathIncludesTarget.value || (element && target.value!.contains(element)) || (corner && getCorner(x, y))
  }

  const isEdgeActive = (edge: Edges) => {
    return unref(edges).includes(edge)
  }

  function handlePointer({ currentX, currentY }: typeof pointer) {
    if (isResizing.value || isOutside.value)
      return

    let { left, right, top, bottom } = target.value!.getBoundingClientRect()

    left += 1
    right -= 1
    top += 1
    bottom -= 1

    if (
      ((currentY - top) < 2 || (currentX - left) < 2)
      && Math.abs(currentY - top) < 8
      && Math.abs(currentX - left) < 8
      && isEdgeActive('top-left')
      && isOnForeground(left, top, true, 1, 1)
    )
      setCursorAndDirection('nwse-resize', 'top-left')

    else if (
      ((currentY - top) < 2 || (currentX - right) > -2)
      && Math.abs(currentY - top) < 8
      && Math.abs(currentX - right) < 8
      && isEdgeActive('top-right')
      && isOnForeground(right, top, true, -1, 1)
    )
      setCursorAndDirection('nesw-resize', 'top-right')

    else if (
      ((currentY - bottom) > -2 || (currentX - left) < 2)
      && Math.abs(currentY - bottom) < 8
      && Math.abs(currentX - left) < 8
      && isEdgeActive('bottom-left')
      && isOnForeground(left, bottom, true, 1, -1)
    )
      setCursorAndDirection('nesw-resize', 'bottom-left')

    else if (
      ((currentY - bottom) > -2 || (currentX - right) > -2)
      && Math.abs(currentY - bottom) < 8
      && Math.abs(currentX - right) < 8
      && isEdgeActive('bottom-right')
      && isOnForeground(right, bottom, true, -1, -1)
    )
      setCursorAndDirection('nwse-resize', 'bottom-right')

    else if (
      (currentY - bottom) < 8
      && (currentY - bottom) >= 0
      && currentX > left
      && currentX < right
      && isEdgeActive('bottom')
      && isOnForeground(currentX, bottom)
    )
      setCursorAndDirection('ns-resize', 'bottom')

    else if (
      (currentY - top) > -8
      && (currentY - top) <= 0
      && currentX > left
      && currentX < right
      && isEdgeActive('top')
      && isOnForeground(currentX, top)
    )
      setCursorAndDirection('ns-resize', 'top')

    else if (
      (currentX - left) > -8
      && (currentX - left) <= 0
      && currentY > top
      && currentY < bottom
      && isEdgeActive('left')
      && isOnForeground(left, currentY)
    )
      setCursorAndDirection('ew-resize', 'left')

    else if (
      (currentX - right) < 8
      && (currentX - right) >= 0
      && currentY > top
      && currentY < bottom
      && isEdgeActive('right')
      && isOnForeground(right, currentY)
    )
      setCursorAndDirection('ew-resize', 'right')

    else
      setCursorAndDirection('', '', '')
  }

  tryOnScopeDispose(stop)

  return {
    width: widthRef,
    height: heightRef,
    stop,
    start,
    direction,
    isActive,
    isOverEdge,
    isResizing,
    onResizeStart: onResizeStart.on,
    onResizeMove: onResizeMove.on,
    onResizeEnd: onResizeEnd.on,
    style,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
