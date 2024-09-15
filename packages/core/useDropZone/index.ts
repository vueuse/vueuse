import type { Ref } from 'vue-demi'

// eslint-disable-next-line no-restricted-imports
import { ref, shallowRef, unref } from 'vue-demi'
import type { MaybeRef, MaybeRefOrGetter } from '@vueuse/shared'
import { isClient } from '@vueuse/shared'

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
  /**
   * Allow multiple files to be dropped. Defaults to true.
   */
  multiple?: boolean
  /**
   * Prevent default behavior for unhandled events. Defaults to false.
   */
  preventDefaultForUnhandled?: boolean
}

export function useDropZone(
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: UseDropZoneOptions | UseDropZoneOptions['onDrop'] = {},
): UseDropZoneReturn {
  const isOverDropZone = ref(false)
  const files = shallowRef<File[] | null>(null)
  let counter = 0
  let isValid = true

  if (isClient) {
    const _options = typeof options === 'function' ? { onDrop: options } : options
    const multiple = _options.multiple ?? true
    const preventDefaultForUnhandled = _options.preventDefaultForUnhandled ?? false

    const getFiles = (event: DragEvent) => {
      const list = Array.from(event.dataTransfer?.files ?? [])
      return list.length === 0 ? null : (multiple ? list : [list[0]])
    }

    const checkDataTypes = (types: string[]) => {
      if (_options.dataTypes) {
        const dataTypes = unref(_options.dataTypes)
        return typeof dataTypes === 'function'
          ? dataTypes(types)
          : dataTypes
            ? dataTypes.some(item => types.includes(item))
            : true
      }
      return true
    }

    const checkValidity = (event: DragEvent) => {
      const items = Array.from(event.dataTransfer?.items ?? [])
      const types = items
        .filter(item => item.kind === 'file')
        .map(item => item.type)

      const dataTypesValid = checkDataTypes(types)
      const multipleFilesValid = multiple || items.filter(item => item.kind === 'file').length <= 1

      return dataTypesValid && multipleFilesValid
    }

    const handleDragEvent = (event: DragEvent, eventType: 'enter' | 'over' | 'leave' | 'drop') => {
      isValid = checkValidity(event)

      if (!isValid) {
        if (preventDefaultForUnhandled) {
          event.preventDefault()
        }
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = 'none'
        }
        return
      }

      event.preventDefault()
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy'
      }

      const currentFiles = getFiles(event)

      switch (eventType) {
        case 'enter':
          counter += 1
          isOverDropZone.value = true
          _options.onEnter?.(null, event)
          break
        case 'over':
          _options.onOver?.(null, event)
          break
        case 'leave':
          counter -= 1
          if (counter === 0)
            isOverDropZone.value = false
          _options.onLeave?.(null, event)
          break
        case 'drop':
          counter = 0
          isOverDropZone.value = false
          if (isValid) {
            files.value = currentFiles
            _options.onDrop?.(currentFiles, event)
          }
          break
      }
    }

    useEventListener<DragEvent>(target, 'dragenter', event => handleDragEvent(event, 'enter'))
    useEventListener<DragEvent>(target, 'dragover', event => handleDragEvent(event, 'over'))
    useEventListener<DragEvent>(target, 'dragleave', event => handleDragEvent(event, 'leave'))
    useEventListener<DragEvent>(target, 'drop', event => handleDragEvent(event, 'drop'))
  }

  return {
    files,
    isOverDropZone,
  }
}
