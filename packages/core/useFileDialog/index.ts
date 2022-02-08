import { readonly, ref } from 'vue-demi'

export interface UseFileDialogOptions {
  multiple?: boolean
  accept?: string
}

const DEFAULT_OPTIONS: Options = {
  multiple: true,
  accept: '*',
}

/**
 * Open file dialog with ease.
 *
 * @see https://vueuse.org/useFileDialog
 * @param options
 */
export function useFileDialog(options?: Partial<Options>) {
  const files = ref<FileList | null>(null)

  const openFileDialog = (localOptions?: Partial<Options>) => {
    const _options: Options = {
      ...DEFAULT_OPTIONS,
      ...options,
      ...localOptions,
    }
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = _options.multiple!
    input.accept = _options.accept!

    input.onchange = (event: Event) => {
      const result = event.target as HTMLInputElement
      files.value = result.files
    }

    input.click()
  }

  return {
    files: readonly(files),
    openFileDialog,
  }
}

export type UseFileDialogReturn = ReturnType<typeof useFileDialog>
