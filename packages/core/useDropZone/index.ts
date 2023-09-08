import { ref, shallowRef } from 'vue-demi'
import type { Ref } from 'vue-demi'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { isClient } from '@vueuse/shared'
import { useEventListener } from '../useEventListener'

export interface UseDropZoneReturn {
  files: Ref<File[] | null>
  isOverDropZone: Ref<boolean>
}

export interface UseDropZoneOptions {
  onDrop?: (files: File[] | null, event: DragEvent) => void
  onEnter?: (files: File[] | null, event: DragEvent) => void
  onLeave?: (files: File[] | null, event: DragEvent) => void
  onOver?: (files: File[] | null, event: DragEvent) => void
}

export function useDropZone(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: UseDropZoneOptions | UseDropZoneOptions['onDrop'] = {},
): UseDropZoneReturn {
  const isOverDropZone = ref(false)
  const files = shallowRef<File[] | null>(null)
  let counter = 0

  if (isClient) {
    const _options = typeof options === 'function' ? { onDrop: options } : options
    const getFiles = (event: DragEvent) => {
      const list = Array.from(event.dataTransfer?.files ?? [])
      return files.value = list.length === 0 ? null : list
    }

    useEventListener<DragEvent>(target, 'dragenter', (event) => {
      event.preventDefault()
      counter += 1
      isOverDropZone.value = true
      _options.onEnter?.(getFiles(event), event)
    })
    useEventListener<DragEvent>(target, 'dragover', (event) => {
      event.preventDefault()
      _options.onOver?.(getFiles(event), event)
    })
    useEventListener<DragEvent>(target, 'dragleave', (event) => {
      event.preventDefault()
      counter -= 1
      if (counter === 0)
        isOverDropZone.value = false
      _options.onLeave?.(getFiles(event), event)
    })
    useEventListener<DragEvent>(target, 'drop', (event) => {
      event.preventDefault()
      counter = 0
      isOverDropZone.value = false
      _options.onDrop?.(getFiles(event), event)
    })
  }

  return {
    files,
    isOverDropZone,
  }
}
