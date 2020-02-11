/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref } from '../../api'
import { useEventListener } from '../useEventListener'

export function useClipboard() {
  const text = ref('')
  const supported = ref('clipboard' in window.navigator)

  useEventListener('copy', () => {
    window.navigator.clipboard.readText().then((value) => {
      text.value = value
    })
  })

  function copy(txt: string) {
    text.value = txt

    return window.navigator.clipboard.writeText(txt)
  }

  return {
    text,
    copy,
    supported,
  }
}
