/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ComputedRef, ref } from 'vue-demi'
import { useEventListener, WindowEventName } from '../useEventListener'
import { ConfigurableNavigator, defaultNavigator } from '../_configurable'

export interface ClipboardOptions extends ConfigurableNavigator {
  /**
   * Enabled reading for clipboard
   *
   * @default true
   */
  read?: boolean
}

/**
 * Reactive Clipboard API.
 *
 * @see   {@link https://vueuse.org/useClipboard}
 * @param options
 */
export function useClipboard(options: ClipboardOptions = {}) {
  const {
    navigator = defaultNavigator,
    read = true,
  } = options

  const events = ['copy', 'cut']
  const isSupported = navigator && 'clipboard' in navigator
  const text = ref('')

  function updateText() {
    // @ts-expect-error untyped API
    navigator.clipboard.readText().then((value) => {
      text.value = value
    })
  }

  if (isSupported && read) {
    for (const event of events)
      useEventListener(event as WindowEventName, updateText)
  }

  async function copy(txt: string) {
    if (isSupported) {
      // @ts-expect-error untyped API
      await navigator.clipboard.writeText(txt)
      text.value = txt
    }
  }

  return {
    isSupported,
    text: text as ComputedRef<string>,
    copy,
  }
}
