/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref, useTimeoutFn } from '@vueuse/shared'
import type { ComputedRef, Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import type { WindowEventName } from '../useEventListener'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'
import type { ConfigurableNavigator } from '../_configurable'
import { defaultNavigator } from '../_configurable'

export interface UseClipboardOptions<Source> extends ConfigurableNavigator {
  /**
   * Enabled reading for clipboard
   *
   * @default false
   */
  read?: boolean

  /**
   * Copy source
   */
  source?: Source

  /**
   * Milliseconds to reset state of `copied` ref
   *
   * @default 1500
   */
  copiedDuring?: number
}

export interface UseClipboardReturn<Optional> {
  isSupported: Ref<boolean>
  text: ComputedRef<string>
  copied: ComputedRef<boolean>
  copy: Optional extends true ? (text?: string) => Promise<void> : (text: string) => Promise<void>
}

/**
 * Reactive Clipboard API.
 *
 * @see https://vueuse.org/useClipboard
 * @param options
 */
export function useClipboard(options?: UseClipboardOptions<undefined>): UseClipboardReturn<false>
export function useClipboard(options: UseClipboardOptions<MaybeComputedRef<string>>): UseClipboardReturn<true>
export function useClipboard(options: UseClipboardOptions<MaybeComputedRef<string> | undefined> = {}): UseClipboardReturn<boolean> {
  const {
    navigator = defaultNavigator,
    read = false,
    source,
    copiedDuring = 1500,
  } = options

  const events = ['copy', 'cut']
  const isSupported = useSupported(() => navigator && 'clipboard' in navigator)
  const text = ref('')
  const copied = ref(false)

  const timeout = useTimeoutFn(() => copied.value = false, copiedDuring)

  function updateText() {
    navigator!.clipboard.readText().then((value) => {
      text.value = value
    })
  }

  if (isSupported.value && read) {
    for (const event of events)
      useEventListener(event as WindowEventName, updateText)
  }

  async function copy(value = resolveUnref(source)) {
    if (isSupported.value && value != null) {
      await navigator!.clipboard.writeText(value)
      text.value = value
      copied.value = true
      timeout.start()
    }
  }

  return {
    isSupported,
    text: text as ComputedRef<string>,
    copied: copied as ComputedRef<boolean>,
    copy,
  }
}
