/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref } from 'vue-demi'
import { useEventListener, WindowEventName } from '../useEventListener'
import { ConfigurableNavigator, defaultNavigator } from '../_configurable'

/**
 * Reactive Clipboard API.
 *
 * @see   {@link https://vueuse.js.org/useClipboard}
 * @param options
 */
export function useClipboard({ navigator = defaultNavigator }: ConfigurableNavigator = {}) {
  const events = ['copy', 'cut']
  const isSupported = navigator && 'clipboard' in navigator
  const text = ref('')

  function updateText() {
    // @ts-expect-error untyped API
    navigator.clipboard.readText().then((value) => {
      text.value = value
    })
  }

  if (isSupported) {
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
    text,
    copy,
  }
}
