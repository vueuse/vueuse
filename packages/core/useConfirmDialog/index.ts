import { Ref } from 'vue-demi'
import { createEventHook, EventHook } from '@vueuse/core'

export interface resolveConfirmDialogArgument<T> {
  data?: T
  isCanceled: boolean
}

export interface useConfirmDialogReturn<T, D, E> {
  /*
  * Opens the dialog. Create promise and return it. Triggers `onReveal` hook.
  */
  reveal: (data?: T) => Promise<resolveConfirmDialogArgument<D | E>>

  /**
   * Confirms and closes the dialog. Triggers a callback inside `onConfirm` hook.
   * Resolves promise from `reveal()` with `data` and `isCanceled` ref with `false` value.
   * Can accept any data and to pass it to `onConfirm` hook.
   */
  confirm: (data?: D) => void

  /**
   * Cancels and closes the dialog. Triggers a callback inside `onCancel` hook.
   * Resolves promise from `reveal()` with `data` and `isCanceled` ref with `true` value.
   * Can accept any data and to pass it to `onCancel` hook.
   */
  cancel: (data?: E) => void

  /**
   * Event Hook to be triggered right before dialog creating.
   */
  onReveal: (fn: (param: T) => void) => { off: () => void }

  /**
   * Event Hook to be called on `confirm()`.
   * Gets data object from `confirm` function.
   */
  onConfirm: (fn: (param: D) => void) => { off: () => void }

  /**
   * Event Hook to be called on `cancel()`.
   * Gets data object from `cancel` function.
   */
  onCancel: (fn: (param: E) => void) => { off: () => void }
}

/**
 * Hooks for creating confirm dialogs. Useful for modal windows, popups and logins.
 *
 * @see https://vueuse.org/core/useConfirmDialog/
 * @param show `boolean` `ref` that handles a modal window
 */

export function useConfirmDialog<T = any, D = any, E = any>(show: Ref<boolean>): useConfirmDialogReturn<T, D, E> {
  const confirmHook: EventHook = createEventHook()
  const cancelHook: EventHook = createEventHook()
  const showHook: EventHook = createEventHook()
  let resolveDialog: { (arg0: resolveConfirmDialogArgument<D | E>): void }

  const reveal = (data?: T) => {
    const promise = new Promise((resolve: { (arg0: resolveConfirmDialogArgument<D | E>): void }) => {
      resolveDialog = resolve
    })
    showHook.trigger(data)
    show.value = true

    return promise
  }
  const confirm = (data?: D) => {
    show.value = false
    confirmHook.trigger(data)

    resolveDialog({ data, isCanceled: false })
  }
  const cancel = (data?: E) => {
    show.value = false
    cancelHook.trigger(data)

    resolveDialog({ data, isCanceled: true })
  }

  return {
    reveal,
    confirm,
    cancel,
    onReveal: showHook.on,
    onConfirm: confirmHook.on,
    onCancel: cancelHook.on,
  }
}
