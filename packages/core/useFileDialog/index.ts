import type { EventHookOn } from '@vueuse/shared'
import type { Ref } from 'vue'
import type { ConfigurableDocument } from '../_configurable'
import type { MaybeElementRef } from '../unrefElement'
import { createEventHook, hasOwn } from '@vueuse/shared'
import { ref as deepRef, readonly } from 'vue'
import { defaultDocument } from '../_configurable'
import { unrefElement } from '../unrefElement'

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
   * The input element to use for file dialog.
   * @default document.createElement('input')
   */
  input?: MaybeElementRef<HTMLInputElement>
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
  } = options

  const files = deepRef<FileList | null>(prepareInitialFiles(options.initialFiles))
  const { on: onChange, trigger: changeTrigger } = createEventHook()
  const { on: onCancel, trigger: cancelTrigger } = createEventHook()
  let input: HTMLInputElement | undefined
  if (document) {
    input = unrefElement(options.input) || document.createElement('input')
    input.type = 'file'

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
