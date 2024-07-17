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
    const getFiles = async (event: DragEvent): Promise<File[]> => {
      return new Promise((resolve) => {
        const dataTransfer = event.dataTransfer!
        const items = dataTransfer.items
        let list: File[] = []
        if (items[0].type === 'text/plain' || !window.webkitURL) {
          list = Array.from(event.dataTransfer?.files ?? [])
          resolve(list)
        }
        else {
          const u = items.length
          let k = 0
          const returnResolve = () => {
            if (k === u)
              resolve(list)
          }
          for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const ItemEntry = item.webkitGetAsEntry()!
            if (ItemEntry.isFile) {
              const fileEntry = ItemEntry as FileSystemFileEntry
              fileEntry.file((file) => {
                list.push(file)
                k = k + 1
                returnResolve()
              })
            }
            if (ItemEntry.isDirectory) {
              const directoryEntry = ItemEntry as FileSystemDirectoryEntry
              const reader = directoryEntry.createReader()
              reader.readEntries((entries) => {
                for (let i = 0; i < entries.length; i++) {
                  const entry = entries[i] as FileSystemFileEntry
                  if (entry.isFile) {
                    entry.file((file) => {
                      list.push(file)
                      if (i === entries.length - 1)
                        k = k + 1
                      returnResolve()
                    })
                  }
                }
              })
            }
          }
        }
      })
    }

    useEventListener<DragEvent>(target, 'dragenter', async (event) => {
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
      const files = await getFiles(event) as File[]
      _options.onDrop?.(files, event)
    })
    useEventListener<DragEvent>(target, 'dragover', async (event) => {
      if (!isDataTypeIncluded)
        return
      event.preventDefault()
      const files = await getFiles(event) as File[]
      _options.onDrop?.(files, event)
    })
    useEventListener<DragEvent>(target, 'dragleave', async (event) => {
      if (!isDataTypeIncluded)
        return
      event.preventDefault()
      counter -= 1
      if (counter === 0)
        isOverDropZone.value = false
      const files = await getFiles(event) as File[]
      _options.onDrop?.(files, event)
    })
    useEventListener<DragEvent>(target, 'drop', async (event) => {
      event.preventDefault()
      counter = 0
      isOverDropZone.value = false
      const files = await getFiles(event) as File[]
      _options.onDrop?.(files, event)
    })
  }

  return {
    files,
    isOverDropZone,
  }
}
