/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { computed } from 'vue-demi'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

/**
 * Reactive Media Query.
 *
 * @see https://vueuse.org/useMobile
 * @param options
 */
export function useMobile(options?: ConfigurableWindow) {
  const { window } = (options || defaultWindow) as ConfigurableWindow

  const isAndroid = computed(() => window?.navigator ? /Android/i.test(window.navigator.userAgent) : false)
  const isIOS = computed(() => window?.navigator ? /iPhone|iPad|iPod/i.test(window.navigator.userAgent) : false)
  const isDesktop = computed(() => window?.navigator ? !isAndroid.value && !isIOS.value : false)

  return {
    isAndroid,
    isIOS,
    isDesktop,
  }
}
