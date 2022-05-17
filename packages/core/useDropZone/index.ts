import { ref } from 'vue-demi'
import type { Ref } from 'vue-demi'

export interface UseDropZoneHandlers {
  dragenter: (event: DragEvent) => void
  dragover: (event: DragEvent) => void
  dragleave: (event: DragEvent) => void
  drop: (event: DragEvent) => void
}

export interface UseDropZoneReturn {
  isOverDropZone: Ref<boolean>
  handlers: UseDropZoneHandlers
}

export function useDropZone(onDrop: (files: File[] | null) => void): UseDropZoneReturn {
  const isOverDropZone = ref(false)
  const counter = ref(0)

  const handlers = {
    dragenter(event: DragEvent) {
      event.preventDefault()
      counter.value += 1
      isOverDropZone.value = true
    },
    dragover(event: DragEvent) {
      event.preventDefault()
    },
    dragleave(event: DragEvent) {
      event.preventDefault()
      counter.value -= 1
      if (counter.value === 0)
        isOverDropZone.value = false
    },
    drop(event: DragEvent) {
      event.preventDefault()
      counter.value = 0
      isOverDropZone.value = false
      const files = Array.from(event.dataTransfer?.files ?? [])
      if (files.length === 0) {
        onDrop(null)
        return
      }
      onDrop(files)
    },
  }

  return {
    isOverDropZone,
    handlers,
  }
}
