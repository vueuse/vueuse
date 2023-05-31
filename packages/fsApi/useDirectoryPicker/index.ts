import { unref } from 'vue-demi'
import type { Awaitable, MaybeRef } from '@vueuse/shared'
import type { ConfigurableWindow } from '@vueuse/core/_configurable'
import { defaultWindow } from '@vueuse/core/_configurable'
import { FsDirectory } from '../Directory/index.js'
import type {
  FileSystemAccessShowDirectoryOptions,
  FileSystemAccessWindow,
} from '../types.js'

export type UseDirectoryPickerOptions = ConfigurableWindow & {
  defaults?: MaybeRef<{
    /** defaults to "read" for read-only access or "readwrite" for read and write access to the directory */
    mode?: FileSystemAccessShowDirectoryOptions['mode']
    /** A FileSystemHandle or a well known directory ("desktop", "documents", "downloads", "music", "pictures", or "videos") to open the dialog in. */
    startIn?: FileSystemAccessShowDirectoryOptions['startIn']
  }>
}

/**
 * Create, read, and write local directories.
 * @see https://vueuse.org/fsApi/useDirectoryPicker
 * @param options
 */
export function useDirectoryPicker(options: UseDirectoryPickerOptions = {}): UseDirectoryPickerReturn {
  const {
    window: _window = defaultWindow,
  } = unref(options)
  const window = _window as FileSystemAccessWindow
  const isSupported = Boolean(window && 'showOpenDirectoryPicker' in window)

  async function open(_options: FileSystemAccessShowDirectoryOptions = {}) {
    if (!isSupported)
      return
    const rawDirectory = await window.showDirectoryPicker({ ...unref(options?.defaults), ..._options })
    return new FsDirectory({ directory: rawDirectory })
  }
  return {
    isSupported,
    open,
  }
}

export interface UseDirectoryPickerReturn {
  isSupported: boolean
  open: (_options?: FileSystemAccessShowDirectoryOptions) => Awaitable<FsDirectory | undefined>
}
