import type { MaybeRef, Ref } from 'vue-demi'

// eslint-disable-next-line no-restricted-imports
import { ref, shallowRef, unref } from 'vue-demi'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { isClient, notNullish } from '@vueuse/shared'

import { useEventListener } from '../useEventListener'

export interface UseDropZoneReturn {
  files: Ref<File[] | null>
  isOverDropZone: Ref<boolean>
}

export interface UseDropZoneOptions {
  /**
   * Allowed data types, if not set, all data types are allowed.
   * Also can be a function to check the data types.
   */
  dataTypes?: MaybeRef<string[]> | ((types: readonly string[]) => boolean)
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
  let isDataTypeIncluded = true
  if (isClient) {
    const _options = typeof options === 'function' ? { onDrop: options } : options
    const getFiles = (event: DragEvent) => {
      const list = Array.from(event.dataTransfer?.files ?? [])
      return (files.value = list.length === 0 ? null : list)
    }

    useEventListener<DragEvent>(target, 'dragenter', (event) => {
      const types = Array.from(event?.dataTransfer?.items || [])
        .map(i => i.kind === 'file' ? i.type : null)
        .filter(notNullish)

      if (_options.dataTypes && event.dataTransfer) {
        const dataTypes = unref(_options.dataTypes)
        isDataTypeIncluded = typeof dataTypes === 'function'
          ? dataTypes(types)
          : dataTypes
            ? dataTypes.some(item => types.includes(item))
            : true
        if (!isDataTypeIncluded)
          return
      }
      event.preventDefault()
      counter += 1
      isOverDropZone.value = true
      _options.onEnter?.(getFiles(event), event)
    })
    useEventListener<DragEvent>(target, 'dragover', (event) => {
      if (!isDataTypeIncluded)
        return
      event.preventDefault()
      _options.onOver?.(getFiles(event), event)
    })
    useEventListener<DragEvent>(target, 'dragleave', (event) => {
      if (!isDataTypeIncluded)
        return
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
