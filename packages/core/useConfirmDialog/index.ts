import { Ref } from 'vue-demi'
import { createEventHook, EventHook, Fn } from '@vueuse/core'

export interface useConfirmDialogReturn<D, E> {
  /*
  * Opens the dialog
  */
  showDialog: Fn

  /**
   * Confirms and closes the dialog. Triggers a callback inside `onConfirm` hook.
   * Can accept any data and to pass it to `onConfirm`.
   */
  confirm: (data?: D) => void

  /**
   * Cancels and closes the dialog. Triggers a callback inside `onCancel` hook.
   * Can accept any data and to pass it to `onCancel`.
   */
  cancel: (data?: E) => void

  /**
   * Event Hook to be called on `confirm`.
   * Gets data object from `confirm` function.
   */
  onConfirm: (fn: (param: D) => void) => { off: () => void }

  /**
   * Event Hook to be called on `cancel`.
   * Gets data object from `cancel` function.
   */
  onCancel: (fn: (param: E) => void) => { off: () => void }
}

/**
 * Hooks for creating confirm dialogs. Useful for modal windows, popups and logins.
 *
 * @see https://vueuse.org/core/useConfirmDialog/
 * @param show ref boolean that handle a modal window
 * @param onShowDialog a function to be called when the modal is creating with `showDialog()`
 */

export function useConfirmDialog<D = any, E = any>(show: Ref<boolean>, onShowDialog?: Fn | undefined): useConfirmDialogReturn<D, E> {
  const confirmHook: EventHook = createEventHook()
  const cancelHook: EventHook = createEventHook()

  const showDialog = () => {
    if (onShowDialog) onShowDialog()
    show.value = true
  }
  const confirm = (data?: D) => {
    show.value = false
    confirmHook.trigger(data)
  }
  const cancel = (data?: E) => {
    show.value = false
    cancelHook.trigger(data)
  }

  return {
    showDialog,
    confirm,
    cancel,
    onConfirm: confirmHook.on,
    onCancel: cancelHook.on,
  }
}
