import type { MaybeRefOrGetter } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { toValue } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

export interface UseBeforeUnloadOptions extends ConfigurableWindow {
  /**
   * Whether to enable the beforeunload event listener.
   * Can be a boolean or a function that returns a boolean.
   */
  enabled?: MaybeRefOrGetter<boolean>
  /**
   * The message to show when the user tries to leave the page.
   * This is used to show a confirmation dialog.
   */
  message?: string
}

/**
 * Reactive state to handle beforeunload event.
 *
 * @see https://vueuse.org/useBeforeUnload
 * @param enabled - Whether to enable the beforeunload event listener
 * @param messageText - The message to show in the confirmation dialog
 * @param options - Additional options
 */
export function useBeforeUnload(
  enabled?: MaybeRefOrGetter<boolean>,
  messageText?: string,
  options?: Omit<UseBeforeUnloadOptions, 'enabled' | 'message'>
): void
export function useBeforeUnload(options?: UseBeforeUnloadOptions): void
export function useBeforeUnload(
  enabledOrOptions?: MaybeRefOrGetter<boolean> | UseBeforeUnloadOptions,
  messageText?: string,
  options?: Omit<UseBeforeUnloadOptions, 'enabled' | 'message'>,
) {
  let finalOptions: UseBeforeUnloadOptions

  if (typeof enabledOrOptions === 'object' && enabledOrOptions !== null && 'window' in enabledOrOptions) {
    finalOptions = enabledOrOptions
  }
  else {
    finalOptions = {
      enabled: enabledOrOptions as MaybeRefOrGetter<boolean>,
      message: messageText,
      ...options,
    }
  }

  const { window = defaultWindow, enabled = true, message } = finalOptions

  const handler = (event: BeforeUnloadEvent) => {
    const finalEnabled = toValue(enabled)

    if (!finalEnabled) {
      return
    }

    event.preventDefault()

    if (message) {
      // Setting returnValue is required for most browsers to show the dialog
      event.returnValue = message
    }

    return message
  }

  if (window) {
    useEventListener(window, 'beforeunload', handler, { passive: false })
  }

  return {
    /**
     * Set the message to show when the user tries to leave the page.
     */
    setMessage: (newMessage: string) => {
      if (window) {
        const newHandler = (event: BeforeUnloadEvent) => {
          event.preventDefault()
          event.returnValue = newMessage
          return newMessage
        }
        useEventListener(window, 'beforeunload', newHandler)
      }
    },
    /**
     * Remove the beforeunload event listener.
     */
    remove: () => {
      if (window) {
        window.removeEventListener('beforeunload', handler)
      }
    },
  }
}
