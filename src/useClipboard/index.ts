/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, onMounted, onUnmounted } from '../api'

export function useClipboard () {
  const text = ref('')
  const supported = ref('clipboard' in navigator)

  async function onCopy () {
    text.value = await navigator.clipboard.readText()
  }

  onMounted(() => {
    window.addEventListener('copy', onCopy)
  })

  onUnmounted(() => {
    window.removeEventListener('copy', onCopy)
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
