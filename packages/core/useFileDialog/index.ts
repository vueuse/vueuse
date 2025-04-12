import type { EventHookOn } from '@vueuse/shared'
import type { Ref } from 'vue'
import type { ConfigurableDocument } from '../_configurable'
import { createEventHook, hasOwn, tryOnScopeDispose } from '@vueuse/shared'
import { ref as deepRef, readonly } from 'vue'
import { defaultDocument } from '../_configurable'

const DEFAULT_INPUT_ID = 'vueuse-file-dialog-input'
export interface UseFileDialogOptions extends ConfigurableDocument {
  /**
   * @default true
   */
  multiple?: boolean
  /**
   * @default '*'
   */
  accept?: string
  /**
   * Select the input source for the capture file.
   * @see [HTMLInputElement Capture](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture)
   */
  capture?: string
  /**
   * Reset when open file dialog.
   * @default false
   */
  reset?: boolean
  /**
   * Select directories instead of files.
   * @see [HTMLInputElement webkitdirectory](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory)
   * @default false
   */
  directory?: boolean

  /**
   * Initial files to set.
   * @default null
   */
  initialFiles?: Array<File> | FileList
  /**
   * Set the id attribute for the input element (for accessibility and testing purposes).
   */
  id?: string
}

const DEFAULT_OPTIONS: UseFileDialogOptions = {
  multiple: true,
  accept: '*',
  reset: false,
  directory: false,
}

export interface UseFileDialogReturn {
  files: Ref<FileList | null>
  open: (localOptions?: Partial<UseFileDialogOptions>) => void
  reset: () => void
  onChange: EventHookOn<FileList | null>
  onCancel: EventHookOn
}

function prepareInitialFiles(files: UseFileDialogOptions['initialFiles']): FileList | null {
  if (!files)
    return null

  if (files instanceof FileList)
    return files

  const dt = new DataTransfer()
  for (const file of files) {
    dt.items.add(file)
  }

  return dt.files
}

/**
 * Open file dialog with ease.
 *
 * @see https://vueuse.org/useFileDialog
 * @param options
 */
export function useFileDialog(options: UseFileDialogOptions = {}): UseFileDialogReturn {
  const {
    document = defaultDocument,
    id,
  } = options

  const files = deepRef<FileList | null>(prepareInitialFiles(options.initialFiles))
  const { on: onChange, trigger: changeTrigger } = createEventHook()
  const { on: onCancel, trigger: cancelTrigger } = createEventHook()
  let input: HTMLInputElement | undefined
  if (document) {
    input = document.createElement('input')
    input.type = 'file'

    Object.assign(input.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clipPath: 'inset(0 0 0 0)', // 使用 clip-path 替代 clip
      whiteSpace: 'nowrap',
      borderWidth: '0',
    })
    input.ariaLabel = '文件上传'
    if (id) {
      input.id = id ?? DEFAULT_INPUT_ID
    }
    tryOnScopeDispose(() => {
      if (input && document && document.body.contains(input)) {
        document.body.removeChild(input)
      }
    })
    document.body.appendChild(input)
    input.onchange = (event: Event) => {
      const result = event.target as HTMLInputElement
      files.value = result.files
      changeTrigger(files.value)
    }

    input.oncancel = () => {
      cancelTrigger()
    }
  }

  const reset = () => {
    files.value = null
    if (input && input.value) {
      input.value = ''
      changeTrigger(null)
    }
  }

  const open = (localOptions?: Partial<UseFileDialogOptions>) => {
    if (!input)
      return
    const _options = {
      ...DEFAULT_OPTIONS,
      ...options,
      ...localOptions,
    }
    input.multiple = _options.multiple!
    input.accept = _options.accept!
    // webkitdirectory key is not stabled, maybe replaced in the future.
    input.webkitdirectory = _options.directory!
    if (hasOwn(_options, 'capture'))
      input.capture = _options.capture!
    if (_options.reset)
      reset()
    input.click()
  }

  return {
    files: readonly(files),
    open,
    reset,
    onCancel,
    onChange,
  }
}
