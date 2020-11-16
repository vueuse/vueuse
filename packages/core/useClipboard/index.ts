/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref } from 'vue-demi'
import { useEventListener, WindowEventName } from '../useEventListener'
import { ConfigurableNavigator, defaultNavigator } from '../_configurable'

/**
 * Reactive Clipboard API
 *
 * @see   {@link https://vueuse.js.org/useClipboard}
 * @param options
 */
export function useClipboard({ navigator = defaultNavigator }: ConfigurableNavigator = {}) {
  const isSupported = navigator && 'clipboard' in navigator
  const text = ref('')

  if (isSupported) {
    useEventListener('copy' as WindowEventName, () => {
      // @ts-expect-error untyped API
      navigator.clipboard.readText().then((value) => {
        text.value = value
      })
    })
  }

  async function copy(txt: string) {
    text.value = txt

    if (isSupported)
      // @ts-expect-error untyped API
      await navigator.clipboard.writeText(txt)
  }

  return {
    isSupported,
    text,
    copy,
  }
}
