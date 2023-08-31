/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toValue, useTimeoutFn } from '@vueuse/shared'
import type { ComputedRef, Ref } from 'vue-demi'
import { computed, ref } from 'vue-demi'
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
  /**
   * Whether Clipboard API is supported or not
   */
  isClipboardApiSupported: ComputedRef<boolean>

  /**
   * Firefox does support Clipboard API, but only writing
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText#browser_compatibility
   */
  isClipboardReadSupported: ComputedRef<boolean>

  /**
   * Whether it is possible to copy text via JS or not
   */
  isSupported: ComputedRef<boolean>

  /**
   * The current text inside the clipboard
   */
  text: Ref<string>

  /**
   * Status where the target text is copied
   */
  copied: Ref<boolean>

  /**
   * The function for Copying the text
   *
   * @param {string} text to be copied
   * @returns {Promise<boolean>}
   */
  copy: Optional extends true ? (text?: string) => Promise<boolean> : (text: string) => Promise<boolean>
}

/**
 * Reactive Clipboard API.
 *
 * @see https://vueuse.org/useClipboard
 * @param options
 */
export function useClipboard(options?: UseClipboardOptions<undefined>): UseClipboardReturn<false>
export function useClipboard(options: UseClipboardOptions<MaybeRefOrGetter<string>>): UseClipboardReturn<true>
export function useClipboard(options: UseClipboardOptions<MaybeRefOrGetter<string> | undefined> = {}): UseClipboardReturn<boolean> {
  const {
    navigator = defaultNavigator,
    read = false,
    source,
    copiedDuring = 1500,
    legacy = false,
  } = options

  const isClipboardApiSupported = useSupported(() => (navigator && 'clipboard' in navigator))
  const isClipboardReadSupported = useSupported(() => (navigator && 'clipboard' in navigator) && navigator.clipboard.readText)
  const isSupported = computed(() => isClipboardApiSupported.value || legacy)
  const text = ref('')
  const copied = ref(false)
  const timeout = useTimeoutFn(() => copied.value = false, copiedDuring)

  function updateText() {
    if (isClipboardReadSupported.value) {
      navigator!.clipboard.readText().then((value) => {
        text.value = value
      })
    }
    else if (legacy) {
      text.value = legacyRead()
    }
  }

  if (isSupported.value && read)
    useEventListener(['copy', 'cut'], updateText)

  async function copy(value = toValue(source)) {
    if (isSupported.value && value != null) {
      if (isClipboardApiSupported.value) {
        try {
          await navigator!.clipboard.writeText(value)
        }
        catch {
          return false
        }
      }
      else {
        if (legacyCopy(value) === false)
          return false
      }

      text.value = value
      copied.value = true
      timeout.start()

      return true
    }
    return false
  }

  function legacyCopy(value: string) {
    const ta = document.createElement('textarea')
    ta.value = value ?? ''
    ta.style.position = 'absolute'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const copyResult = document.execCommand('copy')
    if (!copyResult)
      return false
    ta.remove()
    return true
  }

  function legacyRead() {
    return document?.getSelection?.()?.toString() ?? ''
  }

  return {
    isClipboardApiSupported,
    isClipboardReadSupported,
    isSupported,
    text: text as ComputedRef<string>,
    copied: copied as ComputedRef<boolean>,
    copy,
  }
}
