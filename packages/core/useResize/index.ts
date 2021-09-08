import { watch, ref, reactive, computed, onMounted, Ref, unref } from 'vue-demi'
import { useEventListener, useResizeObserver, createEventHook } from '@vueuse/core'
import { MaybeElementRef } from '../unrefElement'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

export interface UseResizeOptions extends ConfigurableWindow {
  resize?: boolean | Ref<boolean>
  minWidth?: number | 'initial'
  maxWidth?: number | 'initial'
  minHeight?: number | 'initial'
  maxHeight?: number | 'initial'
  edges?: ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | 'top' | 'bottom')[]
}

export function useResize(target: MaybeElementRef, options: UseResizeOptions = {}) {
  const {
    window = defaultWindow,
    resize = true,
    edges = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'left', 'right', 'top', 'bottom'],
  } = options
  let {
    minWidth = 0,
    maxWidth = Infinity,
    minHeight = 0,
    maxHeight = Infinity,
  } = options

  let width = 0
  let height = 0

  const onResizeStart = createEventHook<{ pointer: PointerEvent }>()
  const onResizeEnd = createEventHook<{ pointer: PointerEvent }>()
  const onResizeMove = createEventHook<{
    pointer: PointerEvent
    xDiff: number
    yDiff: number
    setWidth: number
    setHeight: number
    newWidth: number
    newHeight: number
  }>()

  onMounted(() => {
    ({ width, height } = target.value.getClientRects()[0])
    if (minWidth === 'initial') minWidth = width
    if (minHeight === 'initial') minHeight = height
    if (maxWidth === 'initial') maxWidth = width
    if (maxHeight === 'initial') maxHeight = height
  })

  const direction = ref('')
  const cursor = ref('')
  const isResizing = ref(false)

  const pointer = reactive({ startX: 0, startY: 0, currentX: 0, currentY: 0 })
  const isReady = computed(() => cursor.value.includes('resize'))

  if (window) {
    watch(cursor, (value) => {
      window.document.body.style.cursor = value
    })

    useEventListener(window, 'pointerdown', (evt) => {
      if (isReady.value) {
        ({ width, height } = target.value.getClientRects()[0])
        isResizing.value = true
        pointer.startY = evt.y
        pointer.startX = evt.x
        onResizeStart.trigger({ pointer: evt })
        evt.preventDefault()
      }
    })

    useEventListener(window, 'pointerup', (evt) => {
      if (isReady.value) {
        isResizing.value = false
        onResizeEnd.trigger({ pointer: evt })
        evt.preventDefault()
      }
    })

    useEventListener(window, 'pointermove', (evt) => {
      pointer.currentX = evt.x
      pointer.currentY = evt.y

      if (isReady.value && isResizing.value) {
        let setHeight = height
        let setWidth = width
        const yDiff = Math.abs(evt.y - pointer.startY)
        const xDiff = Math.abs(evt.x - pointer.startX)

        if (direction.value.includes('bottom'))
          setHeight = height + (evt.y > pointer.startY ? yDiff : -yDiff)

        if (direction.value.includes('top'))
          setHeight = height + (evt.y > pointer.startY ? -yDiff : yDiff)

        if (direction.value.includes('left'))
          setWidth = width + (evt.x > pointer.startX ? -xDiff : xDiff)

        if (direction.value.includes('right'))
          setWidth = width + (evt.x > pointer.startX ? xDiff : -xDiff)

        onResizeMove.trigger({
          pointer: evt,
          xDiff,
          yDiff,
          setWidth,
          setHeight,
          newWidth: clamp(setWidth, minWidth as number, maxWidth as number),
          newHeight: clamp(setHeight, minHeight as number, maxHeight as number),
        })
        if (unref(resize)) {
          setElementSize(
            target,
            setWidth,
            setHeight,
            minWidth as number,
            maxWidth as number,
            minHeight as number,
            maxHeight as number,
          )
        }
        evt.preventDefault()
      }
    })

    watch(pointer, ({ currentX, currentY }) => {
      if (!target.value || isResizing.value)
        return

      const { left, right, top, bottom } = target.value.getClientRects()[0]

      if (Math.abs(currentY - top) < 5 && Math.abs(currentX - left) < 5 && edges.includes('top-left')) {
        direction.value = 'top-left'
        cursor.value = 'nwse-resize'
      }
      else if (Math.abs(currentY - top) < 5 && Math.abs(currentX - right) < 5 && edges.includes('top-right')) {
        direction.value = 'top-right'
        cursor.value = 'nesw-resize'
      }
      else if (Math.abs(currentY - bottom) < 5 && Math.abs(currentX - left) < 5 && edges.includes('bottom-left')) {
        direction.value = 'bottom-left'
        cursor.value = 'nesw-resize'
      }
      else if (Math.abs(currentY - bottom) < 5 && Math.abs(currentX - right) < 5 && edges.includes('bottom-right')) {
        direction.value = 'bottom-right'
        cursor.value = 'nwse-resize'
      }
      else if (currentX > left && currentX < right && Math.abs(currentY - bottom) < 5 && edges.includes('bottom')) {
        direction.value = 'bottom'
        cursor.value = 'ns-resize'
      }
      else if (currentX > left && currentX < right && Math.abs(currentY - top) < 5 && edges.includes('top')) {
        direction.value = 'top'
        cursor.value = 'ns-resize'
      }
      else if (Math.abs(currentX - left) < 5 && currentY > top && currentY < bottom && edges.includes('left')) {
        direction.value = 'left'
        cursor.value = 'ew-resize'
      }
      else if (Math.abs(currentX - right) < 5 && currentY > top && currentY < bottom && edges.includes('right')) {
        direction.value = 'right'
        cursor.value = 'ew-resize'
      }
      else {
        cursor.value = 'auto'
        direction.value = ''
      }
    })
  }

  const elWidth = ref(0)
  const elHeight = ref(0)
  useResizeObserver(target, () => {
    elWidth.value = target.value.getClientRects()[0].width
    elHeight.value = target.value.getClientRects()[0].height
  })

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

function setElementSize(
  target: Ref<HTMLElement>,
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
