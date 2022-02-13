import type { Ref } from 'vue-demi'
import { ref, unref } from 'vue-demi'
import type { Awaitable, MaybeRef } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

/**
 * window.showOpenFilePicker parameters
 * @see https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker#parameters
 */
export interface FileSystemAccessShowOpenFileOptions {
  multiple?: boolean
  types?: Array<{
    description?: string
    accept: Record<string, string[]>
  }>
  excludeAcceptAllOption?: boolean
}

/**
 * window.showSaveFilePicker parameters
 * @see https://developer.mozilla.org/en-US/docs/Web/API/window/showSaveFilePicker#parameters
 */
export interface FileSystemAccessShowSaveFileOptions {
  suggestedName?: string
  types?: Array<{
    description?: string
    accept: Record<string, string[]>
  }>
  excludeAcceptAllOption?: boolean
}

/**
 * FileHandle
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle
 */
export interface FileSystemFileHandle {
  getFile: () => Promise<File>
  createWritable: () => FileSystemWritableFileStream
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream
 */
interface FileSystemWritableFileStream extends WritableStream {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/write
   */
  write: FileSystemWritableFileStreamWrite
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/seek
   */
  seek: (position: number) => Promise<void>
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/truncate
   */
  truncate: (size: number) => Promise<void>
}

/**
 * FileStream.write
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/write
 */
interface FileSystemWritableFileStreamWrite {
  (data: string | BufferSource | Blob): Promise<void>
  (options: { type: 'write'; position: number; data: string | BufferSource | Blob }): Promise<void>
  (options: { type: 'seek'; position: number }): Promise<void>
  (options: { type: 'truncate'; size: number }): Promise<void>
}

/**
 * FileStream.write
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/write
 */
export type FileSystemAccessWindow = Window & {
  showSaveFilePicker: (options: FileSystemAccessShowSaveFileOptions) => Promise<FileSystemFileHandle>
  showOpenFilePicker: (options: FileSystemAccessShowOpenFileOptions) => Promise<FileSystemFileHandle[]>
}

export type UseFileSystemAccessCommonOptions = Pick<FileSystemAccessShowOpenFileOptions, 'types' | 'excludeAcceptAllOption'>
export type UseFileSystemAccessShowSaveFileOptions = Pick<FileSystemAccessShowSaveFileOptions, 'suggestedName'>

export type UseFileSystemAccessOptions<T = 'Text' | 'ArrayBuffer' | 'Blob'> = ConfigurableWindow & UseFileSystemAccessCommonOptions & {
  /**
   * file data type
   */
  dataType?: T
}

/**
 * Creating, Reading and Writing local files.
 * @see https://vueuse.org/useElementByPoint
 * @param options
 */
export function useFileSystemAccess(options: MaybeRef<UseFileSystemAccessOptions<'Text'>>): UseFileSystemAccessReturn<string>
export function useFileSystemAccess(options: MaybeRef<UseFileSystemAccessOptions<'ArrayBuffer'>>): UseFileSystemAccessReturn<ArrayBuffer>
export function useFileSystemAccess(options: MaybeRef<UseFileSystemAccessOptions<'Blob'>>): UseFileSystemAccessReturn<Blob>
export function useFileSystemAccess(options: any = {}): any {
  const { window = defaultWindow, dataType = 'Text' } = unref(options)
  const isSupported = Boolean(window && 'showSaveFilePicker' in window && 'showOpenFilePicker' in window)

  const fileHandle = ref<FileSystemFileHandle>()
  const data = ref<string| ArrayBuffer | Blob>()

  async function open(_options: UseFileSystemAccessCommonOptions = {}) {
    if (isSupported) {
      const [handle] = await (window as FileSystemAccessWindow).showOpenFilePicker({ ...unref(options), ..._options })
      fileHandle.value = handle
      await readFileData()
    }
  }

  async function create(_options: UseFileSystemAccessShowSaveFileOptions = {}) {
    if (isSupported) {
      fileHandle.value = await (window as FileSystemAccessWindow).showSaveFilePicker({ ...unref(options), ..._options })
      data.value = undefined
      await readFileData()
    }
  }

  async function save(_options: UseFileSystemAccessShowSaveFileOptions = {}) {
    if (isSupported) {
      if (!fileHandle.value)
        // save as
        return saveAs(_options)

      if (data.value) {
        const writableStream = await fileHandle.value.createWritable()
        await writableStream.write(data.value)
        await writableStream.close()
      }
    }
  }

  async function saveAs(_options: UseFileSystemAccessShowSaveFileOptions = {}) {
    if (isSupported) {
      fileHandle.value = await (window as FileSystemAccessWindow).showSaveFilePicker({ ...unref(options), ..._options })

      if (data.value) {
        const writableStream = await fileHandle.value.createWritable()
        await writableStream.write(data.value)
        await writableStream.close()
      }
    }
  }

  async function readFileData() {
    const file = await fileHandle.value?.getFile()
    if (dataType === 'Text')
      data.value = await file?.text()
    if (dataType === 'ArrayBuffer')
      data.value = await file?.arrayBuffer()
    if (dataType === 'Blob')
      data.value = file
  }

  return {
    isSupported,
    data,
    open,
    create,
    save,
  }
}

export interface UseFileSystemAccessReturn<T = string> {
  isSupported: boolean
  data: Ref<T>
  open: (_options?: UseFileSystemAccessCommonOptions) => Awaitable<void>
  create: (_options?: UseFileSystemAccessShowSaveFileOptions) => Awaitable<void>
  save: (_options?: UseFileSystemAccessShowSaveFileOptions) => Awaitable<void>
}
