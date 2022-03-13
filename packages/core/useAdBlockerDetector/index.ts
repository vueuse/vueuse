import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { defaultWindow } from '../_configurable'

const HONEY_POT_URL = '/&ad_code=34&ad_height=23&ad_ids=23&ad_network_23&ad_slot=23&ad_sub=23&ad_system=67'

export async function useAdBlockerDetector(): Promise<Ref<boolean>> {
  return new Promise((resolve) => {
    const hasAdBlocker = ref(false)
    if (!defaultWindow?.XMLHttpRequest) {
      resolve(hasAdBlocker)
      return
    }
    const xhr = new defaultWindow.XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4)
        hasAdBlocker.value = xhr.status === 0

      resolve(hasAdBlocker)
    }
    xhr.open('get', HONEY_POT_URL, true)
    xhr.send()
  })
}
