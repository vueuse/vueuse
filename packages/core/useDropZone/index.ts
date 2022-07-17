import { ref } from 'vue-demi'
import type { Ref } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { isClient } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'

export interface UseDropZoneReturn {
  isOverDropZone: Ref<boolean>
}

export function useDropZone(
  target: MaybeComputedRef<HTMLElement | null | undefined>,
  onDrop?: (files: File[] | null) => void,
): UseDropZoneReturn {
  const isOverDropZone = ref(false)
  let counter = 0

  if (isClient) {
    useEventListener<DragEvent>(target, 'dragenter', (event) => {
      event.preventDefault()
      counter += 1
      isOverDropZone.value = true
    })
    useEventListener<DragEvent>(target, 'dragover', (event) => {
      event.preventDefault()
    })
    useEventListener<DragEvent>(target, 'dragleave', (event) => {
      event.preventDefault()
      counter -= 1
      if (counter === 0)
        isOverDropZone.value = false
    })
    useEventListener<DragEvent>(target, 'drop', (event) => {
      event.preventDefault()
      counter = 0
      isOverDropZone.value = false
      const files = Array.from(event.dataTransfer?.files ?? [])
      onDrop?.(files.length === 0 ? null : files)
    })
  }

  return {
    isOverDropZone,
  }
}
