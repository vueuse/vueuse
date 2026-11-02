import type { MaybeRef, MaybeRefOrGetter, ShallowRef } from 'vue'
import { isClient } from '@vueuse/shared'
// eslint-disable-next-line no-restricted-imports
import { shallowRef, unref } from 'vue'

import { useEventListener } from '../useEventListener'

export interface UseDropZoneReturn {
  files: ShallowRef<File[] | null>
  isOverDropZone: ShallowRef<boolean>
}

export interface UseDropZoneOptions {
  /**
   * Allowed data types, if not set, all data types are allowed.
   * Also can be a function to check the data types.
   */
  dataTypes?: MaybeRef<readonly string[]> | ((types: readonly string[]) => boolean)
  /**
   * Similar to dataTypes, but exposes the DataTransferItemList for custom validation.
   * If provided, this function takes precedence over dataTypes.
   */
  checkValidity?: (items: DataTransferItemList) => boolean
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
  target: MaybeRefOrGetter<HTMLElement | Document | null | undefined>,
  options: UseDropZoneOptions | UseDropZoneOptions['onDrop'] = {},
): UseDropZoneReturn {
  const isOverDropZone = shallowRef(false)
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
      const dataTypes = unref(_options.dataTypes)

      if (typeof dataTypes === 'function')
        return dataTypes(types)

      if (!dataTypes?.length)
        return true

      if (types.length === 0)
        return false

      return types.every(type =>
        dataTypes.some(allowedType => type.includes(allowedType)),
      )
    }

    const checkValidity = (items: DataTransferItemList) => {
      if (_options.checkValidity) {
        return _options.checkValidity(items)
      }

      const types = Array.from(items ?? []).map(item => item.type)

      const dataTypesValid = checkDataTypes(types)
      const multipleFilesValid = multiple || items.length <= 1

      return dataTypesValid && multipleFilesValid
    }

    const checkFileValidity = (fileList: FileList | null | undefined) => {
      if (_options.checkValidity)
        return false

      if (!fileList)
        return false

      const droppedFiles = Array.from(fileList)
      const dataTypesValid = checkDataTypes(droppedFiles.map(file => file.type))
      const multipleFilesValid = multiple || droppedFiles.length <= 1

      return dataTypesValid && multipleFilesValid
    }

    const handleDragEvent = (event: DragEvent, eventType: 'enter' | 'over' | 'leave' | 'drop') => {
      const dataTransferItemList = event.dataTransfer?.items
      if (dataTransferItemList?.length) {
        isValid = checkValidity(dataTransferItemList)
      }
      else if (eventType === 'drop') {
        isValid = checkFileValidity(event.dataTransfer?.files)
      }
      else {
        isValid = !_options.checkValidity
      }

      if (preventDefaultForUnhandled) {
        event.preventDefault()
      }

      if (eventType === 'drop') {
        counter = 0
        isOverDropZone.value = false
      }

      if (!isValid) {
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
