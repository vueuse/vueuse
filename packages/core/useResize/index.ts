import { watch, ref, reactive, computed } from 'vue-demi'
import { useEventListener } from '@vueuse/core'
import { MaybeElementRef } from '../unrefElement'
import { useResizeObserver } from '../useResizeObserver'

export function useResize(target: MaybeElementRef) {
  let height = 0
  let width = 0

  const direction = ref('')
  const cursor = ref('')

  const pointer = reactive({ down: false, startX: 0, startY: 0, currentX: 0, currentY: 0 })
  const isResizing = computed(() => cursor.value.includes('resize'))

  watch(cursor, (value) => { document.body.style.cursor = value })

  useEventListener('pointerdown', (evt) => {
    if (isResizing.value) {
      ({ width, height } = target.value.getClientRects()[0])
      pointer.down = true
      pointer.startY = evt.y
      pointer.startX = evt.x
      evt.preventDefault()
    }
  })

  useEventListener('pointerup', (evt) => {
    if (isResizing.value) {
      pointer.down = false
      evt.preventDefault()
    }
  })

  useEventListener('pointermove', (evt) => {
    pointer.currentX = evt.x
    pointer.currentY = evt.y

    if (isResizing.value && pointer.down) {
      let toSetHeight = height
      let toSetWidth = width
      const yDiff = Math.abs(evt.y - pointer.startY)
      const xDiff = Math.abs(evt.x - pointer.startX)

      if (direction.value.includes('bottom'))
        toSetHeight = height + (evt.y > pointer.startY ? yDiff : -yDiff)

      if (direction.value.includes('top'))
        toSetHeight = height + (evt.y > pointer.startY ? -yDiff : yDiff)

      if (direction.value.includes('left'))
        toSetWidth = width + (evt.x > pointer.startX ? -xDiff : xDiff)

      if (direction.value.includes('right'))
        toSetWidth = width + (evt.x > pointer.startX ? xDiff : -xDiff)

      target.value.style.height = `${toSetHeight}px`
      target.value.style.width = `${toSetWidth}px`
      evt.preventDefault()
    }
  })
  watch(pointer, ({ currentX, currentY }) => {
    if (!target.value || pointer.down)
      return

    currentX -= window.scrollX
    currentY -= window.scrollY

    const { left, right, top, bottom } = target.value.getClientRects()[0]

    if (Math.abs(currentY - top) < 5 && Math.abs(currentX - left) < 5) {
      direction.value = 'top-left'
      cursor.value = 'nwse-resize'
    }
    else if (Math.abs(currentY - top) < 5 && Math.abs(currentX - right) < 5) {
      direction.value = 'top-right'
      cursor.value = 'nesw-resize'
    }
    else if (Math.abs(currentY - bottom) < 5 && Math.abs(currentX - left) < 5) {
      direction.value = 'bottom-left'
      cursor.value = 'nesw-resize'
    }
    else if (Math.abs(currentY - bottom) < 5 && Math.abs(currentX - right) < 5) {
      direction.value = 'bottom-right'
      cursor.value = 'nwse-resize'
    }
    else if (currentX > left && currentX < right && Math.abs(currentY - bottom) < 5) {
      direction.value = 'bottom'
      cursor.value = 'ns-resize'
    }
    else if (currentX > left && currentX < right && Math.abs(currentY - top) < 5) {
      direction.value = 'top'
      cursor.value = 'ns-resize'
    }
    else if (Math.abs(currentX - left) < 5 && currentY > top && currentY < bottom) {
      direction.value = 'left'
      cursor.value = 'ew-resize'
    }
    else if (Math.abs(currentX - right) < 5 && currentY > top && currentY < bottom) {
      direction.value = 'right'
      cursor.value = 'ew-resize'
    }
    else {
      cursor.value = 'auto'
      direction.value = ''
    }
  })

  const elHeight = ref(0)
  const elWidth = ref(0)
  useResizeObserver(target, (entries) => {
    elHeight.value = entries[0].contentRect.height
    elWidth.value = entries[0].contentRect.width
  })

  return { direction, width: elWidth, height: elHeight, isResizing }
}
