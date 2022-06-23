import type { ComputedRef, Ref } from 'vue-demi'
import { computed, ref } from 'vue-demi'
import type { EventHookOn } from '@vueuse/shared'
import { createEventHook, noop } from '@vueuse/shared'

export interface UseDialogResult<T> {
  result?: T
}

export interface HookParameter<T> {
  data?: T
}

export interface UseDialogReturn<Properties, Result> {
  /**
   * Whether the dialog is currently revealed.
   */
  isRevealed: ComputedRef<boolean>

  /**
   * Properties given to the dialog when revealed.
   */
  properties: Ref<Properties | undefined>

  /**
   * Reveals the dialog. Creates a promise and returns it. Triggers the `on.reveal` hook.
   */
  reveal: (properties?: Properties) => Promise<UseDialogResult<Result>>

  /**
   * Closes the dialog. Triggers the `on.reveal` hook.
   */
  close: (result?: Result) => void

  on: {
    /**
     * Hook triggered when the dialog is revealed.
     */
    reveal: EventHookOn<HookParameter<Properties>>

    /**
     * Hook triggered when the dialog is closed.
     */
    close: EventHookOn<HookParameter<Result>>
  }
}

/**
 * Creates an awaitable dialog that can take properties and returns a result.
 */
export function useDialog<
  Properties = any,
  Result = Properties,
>(revealed: Ref<boolean> = ref(false)): UseDialogReturn<Properties, Result> {
  const revealHook = createEventHook<HookParameter<Properties>>()
  const closeHook = createEventHook<HookParameter<Result>>()
  const properties = ref<Properties>()

  let _resolve: (arg0: UseDialogResult<Result>) => void = noop

  async function reveal(data?: Properties) {
    revealed.value = true
    properties.value = data
    revealHook.trigger({ data })

    return new Promise<UseDialogResult<Result>>((resolve) => {
      _resolve = resolve
    })
  }

  function close(data?: Result): void {
    revealed.value = false
    closeHook.trigger({ data })

    _resolve({ result: data })
  }

  return {
    isRevealed: computed(() => revealed.value),
    properties,
    reveal,
    close,
    on: {
      reveal: revealHook.on,
      close: closeHook.on,
    },
  }
}
