import type { EventHookOn } from '@vueuse/shared'
import type { MaybeRef, Ref } from 'vue'
import type { ConfigurableDocument } from '../_configurable'
import type { MaybeElementRef } from '../unrefElement'
import { createEventHook, hasOwn } from '@vueuse/shared'
import { computed, ref as deepRef, readonly, toValue, watchEffect } from 'vue'
import { defaultDocument } from '../_configurable'
import { unrefElement } from '../unrefElement'

export interface UseFileDialogOptions extends ConfigurableDocument {
  /**
   * @default true
   */
  multiple?: MaybeRef<boolean>
  /**
   * @default '*'
   */
  accept?: MaybeRef<string>
  /**
   * Select the input source for the capture file.
   * @see [HTMLInputElement Capture](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture)
   */
  capture?: MaybeRef<string>
  /**
   * Reset when open file dialog.
   * @default false
   */
  reset?: MaybeRef<boolean>
  /**
   * Select directories instead of files.
   * @see [HTMLInputElement webkitdirectory](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory)
   * @default false
   */
  directory?: MaybeRef<boolean>

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
  const inputRef = computed(() => {
    const input = unrefElement(options.input) ?? (document ? document.createElement('input') : undefined)
    if (input) {
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
    return input
  })

  const reset = () => {
    files.value = null
    if (inputRef.value && inputRef.value.value) {
      inputRef.value.value = ''
      changeTrigger(null)
    }
  }

  const applyOptions = (options: UseFileDialogOptions) => {
    const el = inputRef.value
    if (!el)
      return
    el.multiple = toValue(options.multiple)!
    el.accept = toValue(options.accept)!
    // webkitdirectory key is not stabled, maybe replaced in the future.
    el.webkitdirectory = toValue(options.directory)!
    if (hasOwn(options, 'capture'))
      el.capture = toValue(options.capture)!
  }

  const open = (localOptions?: Partial<UseFileDialogOptions>) => {
    const el = inputRef.value
    if (!el)
      return
    const mergedOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      ...localOptions,
    }
    applyOptions(mergedOptions)
    if (toValue(mergedOptions.reset))
      reset()
    el.click()
  }

  watchEffect(() => {
    applyOptions(options)
  })

  return {
    files: readonly(files),
    open,
    reset,
    onCancel,
    onChange,
  }
}
