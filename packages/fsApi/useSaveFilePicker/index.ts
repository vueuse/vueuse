import { type Awaitable, type MaybeRef, toValue } from '@vueuse/shared'
import type { ConfigurableWindow } from '@vueuse/core/_configurable'
import { defaultWindow } from '@vueuse/core/_configurable'
import type {
  FileSystemAccessShowSaveFileOptions,
  FileSystemAccessWindow,
  FileSystemFileHandle,
} from '../types.js'
import { FsFile, type FsFileConstructorOptions } from '../File/index.js'

export type UseSaveFilePickerOptions = ConfigurableWindow & {
  defaults?: MaybeRef<FileSystemAccessShowSaveFileOptions>
}

export type UseSaveFilePickerSaveAsOptions = MaybeRef<FileSystemAccessShowSaveFileOptions>
export type UseSaveFilePickerOpenOptions = MaybeRef<FileSystemAccessShowSaveFileOptions & {
  promptSaveAs?: boolean
}>

function isRealFile(maybeFile: MaybeRef<FsFile | FileSystemFileHandle> | undefined): maybeFile is FsFile {
  return toValue(maybeFile)?.kind === 'file'
}

export function useSaveFilePicker(options: UseSaveFilePickerOptions = {}): UseSaveFilePickerReturn {
  const {
    window: _window = defaultWindow,
  } = toValue(options)
  const window = _window as FileSystemAccessWindow
  const isSupported = Boolean(window && 'showSaveDirectoryPicker' in window)

  async function open(
    _options: UseSaveFilePickerOpenOptions = {},
    file?: FsFileConstructorOptions['file'],
  ) {
    if (!isSupported)
      return
    const sourceFile = isRealFile(file) ? file : undefined

    const { promptSaveAs } = toValue(_options)
    if (promptSaveAs && sourceFile) {
      const resultFile = new FsFile({
        file: await window.showSaveFilePicker({ ...toValue(options?.defaults), ..._options }),
      })
      await resultFile.writeFromStream((await toValue(sourceFile.stream)))
      return resultFile
    }

    const rawFile = isRealFile(file)
      ? toValue(file.rawHandle)
      : await window.showSaveFilePicker({ ...toValue(options?.defaults), ..._options })

    return new FsFile({ file: rawFile })
  }

  // "create" is really the default configuration of the save-file-picker
  const create = open

  async function saveAs(
    file: FsFileConstructorOptions['file'],
    _options: UseSaveFilePickerSaveAsOptions = {},
  ) {
    return open({ ...toValue(_options), promptSaveAs: true }, file)
  }

  return {
    isSupported,
    open,
    create,
    saveAs,
  }
}

export interface UseSaveFilePickerReturn {
  isSupported: boolean
  open: (
    _options?: UseSaveFilePickerOpenOptions,
    file?: FsFileConstructorOptions['file'],
  ) => Awaitable<FsFile | undefined>
  create: (
    _options?: UseSaveFilePickerOpenOptions,
    file?: FsFileConstructorOptions['file'],
  ) => Awaitable<FsFile | undefined>
  saveAs: (
    file: FsFileConstructorOptions['file'],
    _options: UseSaveFilePickerSaveAsOptions
  ) => Awaitable<FsFile | undefined>
}
