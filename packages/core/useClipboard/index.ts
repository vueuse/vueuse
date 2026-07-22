/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import type { ConfigurableNavigator } from '../_configurable'
import type { Supportable } from '../types'
import { useTimeoutFn } from '@vueuse/shared'
import { computed, shallowReadonly, shallowRef, toValue } from 'vue'
import { defaultNavigator } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { usePermission } from '../usePermission'
import { useSupported } from '../useSupported'

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

type ClipboardValue = string | (() => Promise<string | undefined>)

export interface UseClipboardReturn<Optional> extends Supportable {
  text: Readonly<ShallowRef<string>>
  copied: Readonly<ShallowRef<boolean>>
  copyPending: Readonly<ShallowRef<boolean>>
  copy: Optional extends true
    ? (text?: ClipboardValue) => Promise<void>
    : (text: ClipboardValue) => Promise<void>
}

/**
 * Reactive Clipboard API.
 *
 * @see https://vueuse.org/useClipboard
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
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
  const permissionRead = usePermission('clipboard-read', { navigator })
  const permissionWrite = usePermission('clipboard-write', { navigator })
  const isSupported = computed(() => isClipboardApiSupported.value || legacy)
  const text = shallowRef('')
  const copied = shallowRef(false)
  const copyPending = shallowRef(false)
  const timeout = useTimeoutFn(() => copied.value = false, copiedDuring, { immediate: false })

  async function updateText() {
    let useLegacy = !(isClipboardApiSupported.value && isAllowed(permissionRead.value))
    if (!useLegacy) {
      try {
        text.value = await navigator!.clipboard.readText()
      }
      catch {
        useLegacy = true
      }
    }
    if (useLegacy) {
      text.value = legacyRead()
    }
  }

  if (isSupported.value && read)
    useEventListener(['copy', 'cut'], updateText, { passive: true })

  async function copy(value?: ClipboardValue) {
    const resolvedValue = value ?? toValue(source)
    if (isSupported.value && resolvedValue != null) {
      copyPending.value = true
      try {
        // Resolve the value provider exactly once. Keeping its promise lets us
        // hand it to `ClipboardItem` (which preserves the user gesture on
        // Safari) and reuse it in the legacy fallback, so a provider is never
        // invoked twice. See https://github.com/vueuse/vueuse/issues/5539
        const dataPromise = typeof resolvedValue === 'function'
          ? resolvedValue()
          : Promise.resolve(resolvedValue)

        let useLegacy = !(isClipboardApiSupported.value && isAllowed(permissionWrite.value))

        if (!useLegacy) {
          try {
            await navigator!.clipboard.write([createClipboardItem(dataPromise)])
          }
          catch {
            // Fall back only for a genuine Clipboard API failure. When the
            // value provider rejected, awaiting the shared promise below
            // rethrows that error instead of running the provider again.
            useLegacy = true
          }
        }

        if (useLegacy) {
          const data = await dataPromise
          if (data != null) {
            text.value = data
            legacyCopy(data)
          }
        }

        copied.value = true
        timeout.start()
      }
      finally {
        copyPending.value = false
      }
    }
  }

  function createClipboardItem(dataPromise: Promise<string | undefined>): ClipboardItem {
    return new ClipboardItem({
      'text/plain': dataPromise.then((resolvedText = '') => {
        text.value = resolvedText
        return new Blob([resolvedText], { type: 'text/plain' })
      }),
    })
  }

  function legacyCopy(value: string) {
    const ta = document.createElement('textarea')
    ta.value = value
    ta.style.position = 'absolute'
    ta.style.opacity = '0'
    ta.setAttribute('readonly', '')
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }

  function legacyRead() {
    return document?.getSelection?.()?.toString() ?? ''
  }

  function isAllowed(status: PermissionState | undefined) {
    return status === 'granted' || status === 'prompt'
  }

  return {
    copyPending: shallowReadonly(copyPending),
    isSupported,
    text: shallowReadonly(text),
    copied: shallowReadonly(copied),
    copy,
  }
}
