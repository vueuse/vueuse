import type { Ref } from 'vue-demi'
import { computed, ref, unref, watch } from 'vue-demi'
import type { Awaitable, MaybeComputedRef } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import { useSupported } from '../useSupported'

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

export type UseFileSystemAccessOptions = ConfigurableWindow & UseFileSystemAccessCommonOptions & {
  /**
   * file data type
   */
  dataType?: MaybeComputedRef<'Text' | 'ArrayBuffer' | 'Blob'>
}

/**
 * Create and read and write local files.
 * @see https://vueuse.org/useFileSystemAccess
 * @param options
 */
export function useFileSystemAccess(options: UseFileSystemAccessOptions & { dataType: 'Text' }): UseFileSystemAccessReturn<string>
export function useFileSystemAccess(options: UseFileSystemAccessOptions & { dataType: 'ArrayBuffer' }): UseFileSystemAccessReturn<ArrayBuffer>
export function useFileSystemAccess(options: UseFileSystemAccessOptions & { dataType: 'Blob' }): UseFileSystemAccessReturn<Blob>
export function useFileSystemAccess(options: UseFileSystemAccessOptions): UseFileSystemAccessReturn<string | ArrayBuffer | Blob>
export function useFileSystemAccess(options: UseFileSystemAccessOptions = {}): UseFileSystemAccessReturn<string | ArrayBuffer | Blob> {
  const {
    window: _window = defaultWindow,
    dataType = 'Text',
  } = unref(options)
  const window = _window as FileSystemAccessWindow
  const isSupported = useSupported(() => window && 'showSaveFilePicker' in window && 'showOpenFilePicker' in window)

  const fileHandle = ref<FileSystemFileHandle>()
  const data = ref<string | ArrayBuffer | Blob>()

  const file = ref<File>()
  const fileName = computed(() => file.value?.name ?? '')
  const fileMIME = computed(() => file.value?.type ?? '')
  const fileSize = computed(() => file.value?.size ?? 0)
  const fileLastModified = computed(() => file.value?.lastModified ?? 0)

  async function open(_options: UseFileSystemAccessCommonOptions = {}) {
    if (!isSupported.value)
      return
    const [handle] = await window.showOpenFilePicker({ ...unref(options), ..._options })
    fileHandle.value = handle
    await updateFile()
    await updateData()
  }

  async function create(_options: UseFileSystemAccessShowSaveFileOptions = {}) {
    if (!isSupported.value)
      return
    fileHandle.value = await (window as FileSystemAccessWindow).showSaveFilePicker({ ...unref(options), ..._options })
    data.value = undefined
    await updateFile()
    await updateData()
  }

  async function save(_options: UseFileSystemAccessShowSaveFileOptions = {}) {
    if (!isSupported.value)
      return

    if (!fileHandle.value)
    // save as
      return saveAs(_options)

    if (data.value) {
      const writableStream = await fileHandle.value.createWritable()
      await writableStream.write(data.value)
      await writableStream.close()
    }
    await updateFile()
  }

  async function saveAs(_options: UseFileSystemAccessShowSaveFileOptions = {}) {
    if (!isSupported.value)
      return

    fileHandle.value = await (window as FileSystemAccessWindow).showSaveFilePicker({ ...unref(options), ..._options })

    if (data.value) {
      const writableStream = await fileHandle.value.createWritable()
      await writableStream.write(data.value)
      await writableStream.close()
    }

    await updateFile()
  }

  async function updateFile() {
    file.value = await fileHandle.value?.getFile()
  }

  async function updateData() {
    if (unref(dataType) === 'Text')
      data.value = await file.value?.text()
    if (unref(dataType) === 'ArrayBuffer')
      data.value = await file.value?.arrayBuffer()
    if (unref(dataType) === 'Blob')
      data.value = file.value
  }

  watch(() => unref(dataType), updateData)

  return {
    isSupported,
    data,
    file,
    fileName,
    fileMIME,
    fileSize,
    fileLastModified,
    open,
    create,
    save,
    saveAs,
    updateData,
  }
}

export interface UseFileSystemAccessReturn<T = string> {
  isSupported: Ref<boolean>
  data: Ref<T | undefined>
  file: Ref<File | undefined>
  fileName: Ref<string>
  fileMIME: Ref<string>
  fileSize: Ref<number>
  fileLastModified: Ref<number>
  open: (_options?: UseFileSystemAccessCommonOptions) => Awaitable<void>
  create: (_options?: UseFileSystemAccessShowSaveFileOptions) => Awaitable<void>
  save: (_options?: UseFileSystemAccessShowSaveFileOptions) => Awaitable<void>
  saveAs: (_options?: UseFileSystemAccessShowSaveFileOptions) => Awaitable<void>
  updateData: () => Awaitable<void>
}
