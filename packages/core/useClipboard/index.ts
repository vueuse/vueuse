/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { MaybeRef } from '@vueuse/shared'
import { useTimeoutFn } from '@vueuse/shared'
import type { ComputedRef } from 'vue-demi'
import { ref, unref } from 'vue-demi'
import type { WindowEventName } from '../useEventListener'
import { useEventListener } from '../useEventListener'
import type { ConfigurableNavigator } from '../_configurable'
import { defaultNavigator } from '../_configurable'

export interface ClipboardOptions<Source> extends ConfigurableNavigator {
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
   * backup option; call `window.prompt` method
   */
  promptInfo?: string
}

export interface ClipboardReturn<Optional> {
  isSupported: boolean
  isSupportClipBoard: boolean
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
export function useClipboard(options?: ClipboardOptions<undefined>): ClipboardReturn<false>
export function useClipboard(options: ClipboardOptions<MaybeRef<string>>): ClipboardReturn<true>
export function useClipboard(options: ClipboardOptions<MaybeRef<string> | undefined> = {}): ClipboardReturn<boolean> {
  const {
    navigator = defaultNavigator,
    read = false,
    source,
    copiedDuring = 1500,
    promptInfo,
  } = options

  const events = ['copy', 'cut']
  const isSupportClipBoard = Boolean(navigator && 'clipboard' in navigator) && window.isSecureContext
  const isSupportExecCommand = Boolean('execCommand' in document)
  const isSupported = isSupportClipBoard || isSupportExecCommand
  const text = ref('')
  const copied = ref(false)

  const timeout = useTimeoutFn(() => copied.value = false, copiedDuring)

  function updateText() {
    navigator!.clipboard.readText().then((value) => {
      text.value = value
    })
  }

  if (isSupported && read) {
    for (const event of events)
      useEventListener(event as WindowEventName, updateText)
  }

  async function copy(value = unref(source)) {
    if (value === undefined)
      return

    if (isSupportClipBoard) {
      await navigator!.clipboard.writeText(value)
      text.value = value
      copied.value = true
      timeout.start()
    }
    else if (isSupportExecCommand) {
      const textarea = document.createElement('textarea')
      document.body.appendChild(textarea)
      textarea.style.position = 'fixed'
      textarea.style.clip = 'rect(0 0 0 0)'
      textarea.style.top = '-1px'
      textarea.style.zIndex = '-1'
      textarea.style.opacity = '0'
      textarea.value = value
      textarea.select()
      document.execCommand('copy', true)
      document.body.removeChild(textarea)
    }
    else if (promptInfo) {
      window.prompt(promptInfo, value)
    }
    else {
      throw new Error('The current browser does not support the clipboard')
    }
  }

  return {
    isSupported,
    isSupportClipBoard,
    text: text as ComputedRef<string>,
    copied: copied as ComputedRef<boolean>,
    copy,
  }
}
