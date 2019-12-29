/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref } from '../api'
import { useEventListener } from '../useEventListener'

export function useClipboard () {
  const text = ref('')
  const supported = ref('clipboard' in navigator)

  useEventListener('copy', async () => {
    text.value = await navigator.clipboard.readText()
  })

  function copy (txt: string) {
    text.value = txt

    return navigator.clipboard.writeText(txt)
  }

  return {
    text,
    copy,
    supported,
  }
}
