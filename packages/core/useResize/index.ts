import { watch, ref, reactive, Ref, unref, nextTick } from 'vue-demi'
import { useEventListener, useResizeObserver, createEventHook } from '@vueuse/core'
import { MaybeElementRef } from '../unrefElement'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export interface UseResizeOptions extends ConfigurableWindow {
  resize?: boolean | Ref<boolean>
  xMultiplier?: number
  yMultiplier?: number
  borderRadius?: number
  minWidth?: number | Ref<number> | 'initial'
  maxWidth?: number | Ref<number> | 'initial'
  minHeight?: number | Ref<number> | 'initial'
  maxHeight?: number | Ref<number> | 'initial'
  edges?: ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | 'top' | 'bottom')[]
}

export function useResize(target: MaybeElementRef, options: UseResizeOptions = {}) {
  const {
    window = defaultWindow,
    resize = true,
    xMultiplier = 1,
    yMultiplier = 1,
    edges = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'left', 'right', 'top', 'bottom'],
  } = options
  let {
    borderRadius = 0,
    minWidth = 0,
    maxWidth = Infinity,
    minHeight = 0,
    maxHeight = Infinity,
  } = options

  borderRadius /= 2

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
    setSize: typeof setSize
  }>()

  watch(target, (value) => {
    if (!value) return
    ({ width, height } = value.getBoundingClientRect())
    if (minWidth === 'initial') minWidth = width
    if (minHeight === 'initial') minHeight = height
    if (maxWidth === 'initial') maxWidth = width
    if (maxHeight === 'initial') maxHeight = height
  })

  const direction = ref('')
  const cursor = ref('')
  const isResizing = ref(false)

  const pointer = reactive({ startX: 0, startY: 0, currentX: 0, currentY: 0 })
  const isReady = ref(false)

  const edgeHandler = (setCursor: string, setDirection: string) => {
    cursor.value = setCursor
    direction.value = setDirection
  }

  if (window) {
    watch(cursor, (value) => {
      isReady.value = value.includes('resize')
      window.document.body.style.cursor = value
    })

    useEventListener(window, 'pointerdown', async(evt) => {
      if (evt.pointerType === 'touch') {
        pointer.currentX = evt.x
        pointer.currentY = evt.y
        const isrange = rangeHandler(pointer)
        // @ts-ignore
        if (isrange) document.body.style['touch-action'] = 'none'
      }
      await nextTick()
      if (isReady.value || (isReady.value && evt.pointerType === 'touch')) {
        ({ width, height } = target.value.getBoundingClientRect())
        isResizing.value = true
        pointer.startY = evt.y
        pointer.startX = evt.x
        onResizeStart.trigger({ pointer: evt })
        evt.preventDefault()
      }
    })

    const pointerUpLostCancel = (evt: PointerEvent) => {
      if (isReady.value) {
        isResizing.value = false
        if (evt.pointerType === 'touch') {
          edgeHandler('auto', '')
          // @ts-ignore
          document.body.style['touch-action'] = ''
        }
        onResizeEnd.trigger({ pointer: evt })
        evt.preventDefault()
      }
    }

    useEventListener(window, 'pointerup', pointerUpLostCancel)
    useEventListener(window, 'pointercancel', pointerUpLostCancel)
    useEventListener(window, 'lostpointercapture', pointerUpLostCancel)

    useEventListener(window, 'pointermove', (evt) => {
      pointer.currentX = evt.x
      pointer.currentY = evt.y

      if (isReady.value && isResizing.value) {
        let newWidth = width
        let newHeight = height
        const xDiff = Math.abs(evt.x - pointer.startX) * xMultiplier
        const yDiff = Math.abs(evt.y - pointer.startY) * yMultiplier

        if (direction.value.includes('bottom'))
          newHeight += (evt.y > pointer.startY ? yDiff : -yDiff)

        if (direction.value.includes('top'))
          newHeight += (evt.y > pointer.startY ? -yDiff : yDiff)

        if (direction.value.includes('left'))
          newWidth += (evt.x > pointer.startX ? -xDiff : xDiff)

        if (direction.value.includes('right'))
          newWidth += (evt.x > pointer.startX ? xDiff : -xDiff)

        onResizeMove.trigger({
          pointer: evt,
          xDiff,
          yDiff,
          startX: pointer.startX,
          startY: pointer.startY,
          newWidth: clamp(newWidth, unref(minWidth as number), unref(maxWidth as number)),
          newHeight: clamp(newHeight, unref(minHeight as number), unref(maxHeight as number)),
          setSize,
        })
        if (unref(resize)) {
          setSize(
            newWidth,
            newHeight,
            unref(minWidth as number),
            unref(maxWidth as number),
            unref(minHeight as number),
            unref(maxHeight as number),
          )
        }
        evt.preventDefault()
      }
    })

    watch(pointer, rangeHandler)
  }

  function rangeHandler({ currentX, currentY }: typeof pointer) {
    if (!target.value || isResizing.value || !window)
      return

    let { left, right, top, bottom } = target.value.getBoundingClientRect()

    left += 1
    right -= 1
    top += 1
    bottom -= 1

    if (
      ((currentY - top + borderRadius) < 5 || (currentX - left + borderRadius) < 5)
      && Math.abs(currentY - top) < 8 && Math.abs(currentX - left) < 8
      && edges.includes('top-left')
      && window.document.elementFromPoint(left + borderRadius, top + borderRadius) === target.value
    ) {
      edgeHandler('nwse-resize', 'top-left')
    }
    else if (
      ((currentY - top + borderRadius) < 8 || (currentX - right - borderRadius) < 8)
      && Math.abs(currentY - top) < 8
      && Math.abs(currentX - right) < 8
      && edges.includes('top-right')
      && window.document.elementFromPoint(right - borderRadius, top + borderRadius) === target.value
    ) {
      edgeHandler('nesw-resize', 'top-right')
    }
    else if (
      ((currentY - bottom - borderRadius) < 8 || (currentX - left + borderRadius) < 8)
      && Math.abs(currentY - bottom) < 8
      && Math.abs(currentX - left) < 8
      && edges.includes('bottom-left')
      && window.document.elementFromPoint(left + borderRadius, bottom - borderRadius) === target.value
    ) {
      edgeHandler('nesw-resize', 'bottom-left')
    }
    else if (
      ((currentY - bottom - borderRadius) < 8 || (currentX - right - borderRadius) < 8)
      && Math.abs(currentY - bottom) < 8
      && Math.abs(currentX - right) < 8
      && edges.includes('bottom-right')
      && window.document.elementFromPoint(right - borderRadius, bottom - borderRadius) === target.value
    ) {
      edgeHandler('nwse-resize', 'bottom-right')
    }
    else if (
      (currentY - bottom) < 8
      && (currentY - bottom) >= 0
      && currentX > left
      && currentX < right
      && edges.includes('bottom')
      && window.document.elementFromPoint(currentX, bottom) === target.value
    ) {
      edgeHandler('ns-resize', 'bottom')
    }
    else if (
      (currentY - top) > -8
      && (currentY - top) <= 0
      && currentX > left
      && currentX < right
      && edges.includes('top')
      && window.document.elementFromPoint(currentX, top) === target.value
    ) {
      edgeHandler('ns-resize', 'top')
    }
    else if (
      (currentX - left) > -8
      && (currentX - left) <= 0
      && currentY > top
      && currentY < bottom
      && edges.includes('left')
      && window.document.elementFromPoint(left, currentY) === target.value
    ) {
      edgeHandler('ew-resize', 'left')
    }
    else if (
      (currentX - right) < 8
      && (currentX - right) >= 0
      && currentY > top
      && currentY < bottom
      && edges.includes('right')
      && window.document.elementFromPoint(right, currentY) === target.value
    ) {
      edgeHandler('ew-resize', 'right')
    }
    else {
      edgeHandler('auto', '')
      return false
    }
    return true
  }

  const elWidth = ref(0)
  const elHeight = ref(0)
  let warned = false
  useResizeObserver(target, (entries) => {
    elWidth.value = target.value.getBoundingClientRect().width
    elHeight.value = target.value.getBoundingClientRect().height

    if (!warned && (entries[0].contentRect.width === elWidth.value || entries[0].contentRect.height === elHeight.value)) {
      warned = true
      console.warn('To make useResize function properly, target element must have at least 1px width padding or border.')
    }
  })

  function setSize(
    width: number,
    height: number,
    minWidth: number,
    maxWidth: number,
    minHeight: number,
    maxHeight: number,
  ) {
    target.value.style.width = `${clamp(width, minWidth, maxWidth)}px`
    target.value.style.height = `${clamp(height, minHeight, maxHeight)}px`
  }

  return {
    direction,
    width: elWidth,
    height: elHeight,
    isReady,
    isResizing,
    onResizeStart: onResizeStart.on,
    onResizeMove: onResizeMove.on,
    onResizeEnd: onResizeEnd.on,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
