import type { Ref } from 'vue-demi'
import { ref } from 'vue-demi'
import { defaultWindow } from '../_configurable'

// Parameters taken from easylist general advert blocking filters
// https://easylist.to/easylist/easylist.txt
const HONEY_POT_URL = '/&ad_code=ad&ad_height=ad&ad_ids=ad&ad_network_ad&ad_slot=ad&ad_sub=ad&ad_system=ad'

const hasAdBlocker = ref(false)
/**
 * Check if the user has an active ad blocker.
 *
 * @see https://vueuse.org/core/useAdBlockerDetector
 */
export async function useAdBlockerDetector(): Promise<Ref<boolean>> {
  try {
    await defaultWindow?.fetch(HONEY_POT_URL)
  }
  catch (e) {
    hasAdBlocker.value = true
  }
  return hasAdBlocker
}
