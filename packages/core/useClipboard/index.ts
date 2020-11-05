/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref } from 'vue-demi'
import { useEventListener, WindowEventName } from '../useEventListener'

export function useClipboard() {
  const isSupported = 'clipboard' in navigator
  const text = ref('')

  if (isSupported) {
    useEventListener('copy' as WindowEventName, () => {
      window.navigator.clipboard.readText().then((value) => {
        text.value = value
      })
    })
  }

  async function copy(txt: string) {
    text.value = txt

    if (isSupported)
      await window.navigator.clipboard.writeText(txt)
  }

  return {
    isSupported,
    text,
    copy,
  }
}
