import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'

// Parameters taken from easylist general advert blocking filters
// https://easylist.to/easylist/easylist.txt
const HONEY_POT_URL = '/&ad_code=ad&ad_height=ad&ad_ids=ad&ad_network_ad&ad_slot=ad&ad_sub=ad&ad_system=ad'

export async function useAdBlockerDetector(): Promise<Ref<boolean>> {
  const hasAdBlocker = ref(false)
  try {
    await fetch(HONEY_POT_URL)
  }
  catch (e) {
    hasAdBlocker.value = true
  }
  return hasAdBlocker
}
