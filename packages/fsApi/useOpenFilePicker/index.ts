import { type Awaitable, type MaybeRef, toValue } from '@vueuse/shared'
import type { ConfigurableWindow } from '@vueuse/core/_configurable'
import { defaultWindow } from '@vueuse/core/_configurable'
import type {
  FileSystemAccessShowOpenFileOptions,
  FileSystemAccessWindow,
} from '../types.js'
import { FsFile } from '../File/index.js'

export type UseOpenFilePickerOptions = ConfigurableWindow & {
  defaults?: MaybeRef<FileSystemAccessShowOpenFileOptions>
}

export function useOpenFilePicker(options: UseOpenFilePickerOptions = {}): UseOpenFilePickerReturn {
  const {
    window: _window = defaultWindow,
  } = toValue(options)
  const window = _window as FileSystemAccessWindow
  const isSupported = Boolean(window && 'showOpenDirectoryPicker' in window)

  async function open(_options: FileSystemAccessShowOpenFileOptions = {}) {
    if (!isSupported)
      return
    const rawFiles = await window.showOpenFilePicker({ ...toValue(options?.defaults), ..._options })
    return rawFiles.map(rawFile => new FsFile({ file: rawFile }))
  }
  return {
    isSupported,
    open,
  }
}

export interface UseOpenFilePickerReturn {
  isSupported: boolean
  open: (_options?: FileSystemAccessShowOpenFileOptions) => Awaitable<FsFile[] | undefined>
}
