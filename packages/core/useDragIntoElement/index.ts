import type { Ref } from 'vue-demi'
import { computed, ref, unref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'
import { toRefs } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'
import type { Position } from '../types'

interface DropPosition {
  left: number
  right: number
  top: number
  bottom: number
}

export interface UseDragIntoElementOptions {

  /**
   * Callback when the dragging starts.
   */
  onStart?: (event: DragEvent) => void

  /**
   * Callback when drop.
   */
  onDrop?: (position: DropPosition, event: DragEvent) => void

  /**
   * Callback when dragging end.
   */
  onEnd?: (event: DragEvent) => void
}

export function useDragIntoElement(dragElement: MaybeRef<HTMLElement | SVGElement | null>, dropElement: MaybeRef<HTMLElement | SVGElement | null>, options: UseDragIntoElementOptions = {}) {
  const pressedDelta = ref<Position>()
  const position: Ref<DropPosition> = ref({ left: 0, right: 0, top: 0, bottom: 0 })

  useEventListener(dragElement, 'dragstart', (e: DragEvent) => {
    const rect = unref(dragElement)!.getBoundingClientRect()
    const pos = {
      x: e.x - rect.left,
      y: e.y - rect.top,
    }
    pressedDelta.value = pos
    options.onStart?.(e)
  })

  useEventListener(dropElement, 'drop', (e: DragEvent) => {
    if (!pressedDelta.value) return
    e.preventDefault()
    const droppableEle = unref(dropElement)!
    const draggableEle = unref(dragElement)!
    const rect = droppableEle.getBoundingClientRect()
    const left = e.x - rect.left - pressedDelta.value!.x
    const top = e.y - rect.top - pressedDelta.value!.y
    const right = droppableEle.clientWidth - draggableEle.clientWidth - left
    const bottom = droppableEle.clientHeight - draggableEle.clientHeight - top
    const pos = {
      left: Math.floor(left),
      top: Math.floor(top),
      bottom: Math.floor(bottom),
      right: Math.floor(right),
    }
    position.value = pos
    options.onDrop?.(pos, e)
  })

  useEventListener(dropElement, 'dragover', (e: DragEvent) => {
    e.preventDefault()
  })

  useEventListener(dragElement, 'dragend', (e: DragEvent) => {
    pressedDelta.value = undefined
    options.onEnd?.(e)
  })

  return {
    ...toRefs(position),
    position,
    isDragging: computed(() => !!pressedDelta.value),
  }
}

export type UseDragIntoElementReturn = ReturnType<typeof useDragIntoElement>
