import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import type { Awaitable } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

export interface FileSystemAccessOpenFileOptions {
  multiple?: boolean
  types?: Array<{
    description?: string
    accept?: Record<string, string[]>
  }>
  excludeAcceptAllOption?: boolean
}

export interface FileSystemAccessSaveFileOptions {
  types?: Array<{
    description?: string
    accept?: Record<string, string[]>
  }>
  suggestedName?: string
  excludeAcceptAllOption?: boolean
}

interface FileSystemFileHandle {
  getFile: () => Promise<File>
  createWritable: () => FileSystemWritableFileStream
}

interface FileSystemWritableFileStream extends WritableStream {
  // TODO: types https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/write
  write: (data: string | BufferSource | Blob) => Promise<void>
  seek: (position: number) => Promise<void>
  truncate: (size: number) => Promise<void>
}

type FileSystemAccessWindow = Window & {
  showSaveFilePicker: (options: FileSystemAccessSaveFileOptions) => Promise<FileSystemFileHandle>
  showOpenFilePicker: (options: FileSystemAccessOpenFileOptions) => Promise<FileSystemFileHandle[]>
}

export interface UseFileSystemAccessOptions extends ConfigurableWindow {
}

export type UseFileSystemAccessMultipleReturn = UseFileSystemAccessReturn & {
  content: Ref<any>// TODO: types
}

export interface UseFileSystemAccessReturn {
  isSupported: boolean
  content: Ref<any> // TODO: types
  open: () => Awaitable<void>
  create: () => Awaitable<void>
  save: () => Awaitable<void>
}

export function useFileSystemAccess(options: UseFileSystemAccessOptions & { multiple: true }): UseFileSystemAccessMultipleReturn
export function useFileSystemAccess(options: UseFileSystemAccessOptions = {}): UseFileSystemAccessReturn {
  const { window = defaultWindow } = options
  const isSupported = Boolean(window && 'showSaveFilePicker' in window && 'showOpenFilePicker' in window)

  const fileHandle = ref<FileSystemFileHandle>()
  const content = ref()

  async function open(options: FileSystemAccessOpenFileOptions = {}) {
    if (isSupported) {
      const [handle] = await (window as FileSystemAccessWindow).showOpenFilePicker(options)
      fileHandle.value = handle
      await readContent()
    }
  }

  async function create(options: FileSystemAccessSaveFileOptions = {}) {
    if (isSupported) {
      fileHandle.value = await (window as FileSystemAccessWindow).showSaveFilePicker(options)
      content.value = undefined
    }
  }

  async function save(options: FileSystemAccessSaveFileOptions = {}) {
    if (isSupported) {
      if (!fileHandle.value)
        // save as
        fileHandle.value = await (window as FileSystemAccessWindow).showSaveFilePicker(options)

      const writableStream = await fileHandle.value.createWritable()
      await writableStream.write(content.value)
      await writableStream.close()
    }
  }

  async function readContent() {
    const file = await fileHandle.value?.getFile()
    if (file)
      content.value = await file.text()
  }

  return {
    isSupported,
    content,
    open,
    create,
    save,
  }
}
