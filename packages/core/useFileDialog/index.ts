import { readonly, ref } from 'vue-demi'

export interface UseFileDialogOptions {
  multiple?: boolean
  accept?: string
  capture?: 'user' | 'environment'
}

const DEFAULT_OPTIONS: UseFileDialogOptions = {
  multiple: true,
  accept: '*',
}

/**
 * Open file dialog with ease.
 *
 * @see https://vueuse.org/useFileDialog
 * @param options
 */
export function useFileDialog(options?: Partial<UseFileDialogOptions>) {
  const files = ref<FileList | null>(null)

  const input = document.createElement('input')
  input.type = 'file'

  input.onchange = (event: Event) => {
    const result = event.target as HTMLInputElement
    files.value = result.files
  }

  const open = (localOptions?: Partial<UseFileDialogOptions>) => {
    const _options = {
      ...DEFAULT_OPTIONS,
      ...options,
      ...localOptions,
    }
    input.multiple = _options.multiple!
    input.accept = _options.accept!
    input.capture = _options.capture!

    input.click()
  }

  const reset = () => {
    files.value = null
  }

  return {
    files: readonly(files),
    open,
    reset,
  }
}

export type UseFileDialogReturn = ReturnType<typeof useFileDialog>
