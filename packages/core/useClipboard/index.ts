/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref, useTimeoutFn } from '@vueuse/shared'
import type { ComputedRef, Ref } from 'vue-demi'
import { computed, ref } from 'vue-demi'
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

  /**
   * Whether fallback to document.execCommand('copy') if clipboard is undefined.
   *
   * @default false
   */
  legacy?: boolean
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
    legacy = false,
  } = options

  const events = ['copy', 'cut']
  const isClipboardApiSupported = useSupported(() => (navigator && 'clipboard' in navigator))
  const isSupported = computed(() => isClipboardApiSupported.value || legacy)
  const text = ref('')
  const copied = ref(false)
  const timeout = useTimeoutFn(() => copied.value = false, copiedDuring)

  function updateText() {
    if (isClipboardApiSupported.value) {
      navigator!.clipboard.readText().then((value) => {
        text.value = value
      })
    }
    else {
      text.value = legacyRead()
    }
  }

  if (isSupported.value && read) {
    for (const event of events)
      useEventListener(event as WindowEventName, updateText)
  }

  async function copy(value = resolveUnref(source)) {
    if (isSupported.value && value != null) {
      if (isClipboardApiSupported.value)
        await navigator!.clipboard.writeText(value)
      else
        legacyCopy(value)

      text.value = value
      copied.value = true
      timeout.start()
    }
  }

  function legacyCopy(value: string) {
    const ta = document.createElement('textarea')
    ta.value = value ?? ''
    ta.style.position = 'absolute'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }

  function legacyRead() {
    return document?.getSelection?.()?.toString() ?? ''
  }

  return {
    isSupported,
    text: text as ComputedRef<string>,
    copied: copied as ComputedRef<boolean>,
    copy,
  }
}
