import type { ComputedRef, InjectionKey, Ref } from 'vue-demi'
import { computed, provide, ref } from 'vue-demi'
import type { EventHook, EventHookOn } from '@vueuse/shared'
import { createEventHook, noop } from '@vueuse/shared'

export type UseConfirmDialogRevealResult<C, D>
  = {
    data?: C
    isCanceled: false
  } | {
    data?: D
    isCanceled: true
  }

export interface UseConfirmDialogReturn<RevealData, ConfirmData, CancelData> {
  /**
   * Revealing state
   */
  isRevealed: ComputedRef<boolean>

  token: InjectionKey<Omit<UseConfirmDialogReturn<RevealData, ConfirmData, CancelData>, 'token' | 'reveal'>>

  /**
   * Opens the dialog.
   * Create promise and return it. Triggers `onReveal` hook.
   */
  reveal: (data?: RevealData) => Promise<UseConfirmDialogRevealResult<ConfirmData, CancelData>>

  /**
   * Confirms and closes the dialog. Triggers a callback inside `onConfirm` hook.
   * Resolves promise from `reveal()` with `data` and `isCanceled` ref with `false` value.
   * Can accept any data and to pass it to `onConfirm` hook.
   */
  confirm: (data?: ConfirmData) => void

  /**
   * Cancels and closes the dialog. Triggers a callback inside `onCancel` hook.
   * Resolves promise from `reveal()` with `data` and `isCanceled` ref with `true` value.
   * Can accept any data and to pass it to `onCancel` hook.
   */
  cancel: (data?: CancelData) => void

  /**
   * Event Hook to be triggered right before dialog creating.
   */
  onReveal: EventHookOn<RevealData>

  /**
   * Event Hook to be called on `confirm()`.
   * Gets data object from `confirm` function.
   */
  onConfirm: EventHookOn<ConfirmData>

  /**
   * Event Hook to be called on `cancel()`.
   * Gets data object from `cancel` function.
   */
  onCancel: EventHookOn<CancelData>
}

/**
 * Hooks for creating confirm dialogs. Useful for modal windows, popups and logins.
 *
 * @see https://vueuse.org/useConfirmDialog/
 * @param revealed `boolean` `ref` that handles a modal window
 */
export function useConfirmDialog<
  RevealData = any,
  ConfirmData = any,
  CancelData = any,
>(revealed: Ref<boolean> = ref(false)): UseConfirmDialogReturn<RevealData, ConfirmData, CancelData> {
  const confirmHook: EventHook = createEventHook<ConfirmData>()
  const cancelHook: EventHook = createEventHook<CancelData>()
  const revealHook: EventHook = createEventHook<RevealData>()

  let _resolve: (arg0: UseConfirmDialogRevealResult<ConfirmData, CancelData>) => void = noop

  const reveal = (data?: RevealData) => {
    revealHook.trigger(data)
    revealed.value = true

    return new Promise<UseConfirmDialogRevealResult<ConfirmData, CancelData>>((resolve) => {
      _resolve = resolve
    })
  }

  const confirm = (data?: ConfirmData) => {
    revealed.value = false
    confirmHook.trigger(data)

    _resolve({ data, isCanceled: false })
  }

  const cancel = (data?: CancelData) => {
    revealed.value = false
    cancelHook.trigger(data)
    _resolve({ data, isCanceled: true })
  }

  const isRevealed = computed(() => revealed.value)
  const provided = {
    isRevealed,
    confirm,
    cancel,
    onReveal: revealHook.on,
    onConfirm: confirmHook.on,
    onCancel: cancelHook.on,
  }

  const token: InjectionKey<typeof provided> = Symbol('confirmDialog')

  provide(token, provided)
  return {
    isRevealed,
    token,
    reveal,
    confirm,
    cancel,
    onReveal: revealHook.on,
    onConfirm: confirmHook.on,
    onCancel: cancelHook.on,
  }
}
