import type { MaybeRef } from '@vueuse/shared'

/**
 * window.showOpenFilePicker parameters
 * @see https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker#parameters
 */
export interface FileSystemAccessShowOpenFileOptions {
  /** allow selection of multiple files */
  multiple?: boolean
  /** allowed file types */
  types?: Array<{
    description?: string
    accept: Record<string, string[]>
  }>
  /** prevent user from bypassing allowed types and choosing to show everything as available for selection */
  excludeAcceptAllOption?: boolean
}

/**
 * window.showSaveFilePicker parameters
 * @see https://developer.mozilla.org/en-US/docs/Web/API/window/showSaveFilePicker#parameters
 */
export interface FileSystemAccessShowSaveFileOptions {
  /** prefill file name with a suggestion */
  suggestedName?: string
  /** allowed file types */
  types?: Array<{
    description?: string
    accept: Record<string, string[]>
  }>
  /** prevent user from bypassing allowed types and choosing to show everything as available for selection */
  excludeAcceptAllOption?: boolean
}

/**
 * window.showDirectoryPicker parameters
 * @see https://developer.mozilla.org/en-US/docs/Web/API/window/showDirectoryPicker#parameters
 */
export interface FileSystemAccessShowDirectoryOptions {
  /** An id to remember selection by, to reopen at later */
  id?: string
  /** defaults to "read" for read-only access or "readwrite" for read and write access to the directory */
  mode?: 'read' | 'readwrite'
  /** A FileSystemHandle or a well known directory ("desktop", "documents", "downloads", "music", "pictures", or "videos") to open the dialog in. */
  startIn?: FileSystemFileHandle | FileSystemDirectoryHandle | string
}

export type FileHandleKind = 'file' | 'directory'
export type FileHandlePermissionStatus_State = 'granted' | 'denied' | 'prompt'

export type Writable = MaybeRef<WritableArgs>

export interface FileSystemHandlePermissionDescriptor {
  mode: 'read' | 'readwrite'
}

/**
 * FileSystemHandle
 * Generic handle inherited by others
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemHandle
 */
export interface FileSystemHandle<K extends FileHandleKind> {
  kind: K
  name: string
  isSameEntry: (fsHandle: FileSystemHandle<FileHandleKind>) => boolean
  queryPermission: (fsHandlePermDesc: FileSystemHandlePermissionDescriptor) => Promise<FileHandlePermissionStatus_State>
  requestPermission: (fsHandlePermDesc: FileSystemHandlePermissionDescriptor) => Promise<FileHandlePermissionStatus_State>
}

/**
 * FileHandle.createWritable()
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createWritable
 */
export interface FileSystemCreateWritableOptions {
  keepExistingData: boolean
}

/**
 * FileHandle
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle
 */
export interface FileSystemFileHandle extends FileSystemHandle<'file'> {
  getFile: () => Promise<File>
  createWritable: (options: FileSystemCreateWritableOptions) => Promise<FileSystemWritableFileStream>
}

export type DirectoryEntry = FileSystemFileHandle | FileSystemDirectoryHandle
/**
 * FileHandle
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle
 */
export interface FileSystemDirectoryHandle extends FileSystemHandle<'directory'> {
  // Async Iterators
  [Symbol.iterator]: () => AsyncIterator<[string, FileSystemFileHandle | FileSystemDirectoryHandle]>
  entries: () => AsyncIterable<[string, FileSystemFileHandle | FileSystemDirectoryHandle]>
  keys: () => AsyncIterable<string>
  values: () => AsyncIterable<FileSystemFileHandle | FileSystemDirectoryHandle>

  getFileHandle: (name: string, options?: { create?: boolean }) => Promise<FileSystemFileHandle>
  getDirectoryHandle: (name: string, options?: { create?: boolean }) => Promise<FileSystemDirectoryHandle>
  removeEntry: (name: string, options?: { recursive?: boolean }) => Promise<undefined>

  resolve: (possibleDescendantName: string) => Promise<null | string[]>
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream
 */
export interface FileSystemWritableFileStream extends WritableStream {
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

export type WritableData = string | BufferSource | Blob | DataView
export type WritableArgs =
  | WritableData
  | { type: 'write', position: number, data: WritableData }
  | { type: 'seek', position: number }
  | { type: 'truncate', size: number }

/**
 * FileStream.write
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/write
 */
export type FileSystemWritableFileStreamWrite = (options: WritableArgs) => Promise<void>

export type UseFileSystemAccessCommonOptions = Pick<FileSystemAccessShowOpenFileOptions, 'types' | 'excludeAcceptAllOption'>
export type UseFileSystemAccessShowSaveFileOptions = Pick<FileSystemAccessShowSaveFileOptions, 'suggestedName'>

/**
 * FileStream.write
 * @see https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream/write
 */
export type FileSystemAccessWindow = Window & {
  showSaveFilePicker: (options?: FileSystemAccessShowSaveFileOptions) => Promise<FileSystemFileHandle>
  showOpenFilePicker: (options?: FileSystemAccessShowOpenFileOptions) => Promise<FileSystemFileHandle[]>
  showDirectoryPicker: (options?: FileSystemAccessShowDirectoryOptions) => Promise<FileSystemDirectoryHandle>
  FileSystemHandle: FileSystemHandle<'directory' | 'file'>
  FileSystemFileHandle: FileSystemFileHandle
  FileSystemDirectoryHandle: FileSystemDirectoryHandle
  FileSystemWritableFileStream: FileSystemWritableFileStream
}
