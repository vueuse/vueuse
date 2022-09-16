/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { ref, watchEffect } from 'vue-demi'
import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveRef, tryOnScopeDispose } from '@vueuse/shared'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'
import { useSupported } from '../useSupported'

/**
 * Reactive Media Query.
 *
 * @see https://vueuse.org/useMediaQuery
 * @param query
 * @param options
 */
export function useMediaQuery(query: MaybeComputedRef<string>, options: ConfigurableWindow = {}) {
  const { window = defaultWindow } = options
  const isSupported = useSupported(() => window && 'matchMedia' in window && typeof window.matchMedia === 'function')

  let mediaQuery: MediaQueryList | undefined
  const matches = ref(false)

  const cleanup = () => {
    if (!mediaQuery)
      return
    if ('removeEventListener' in mediaQuery)
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      mediaQuery.removeEventListener('change', update)
    else
      // @ts-expect-error deprecated API
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      mediaQuery.removeListener(update)
  }

  const update = () => {
    if (!isSupported.value)
      return

    cleanup()

    mediaQuery = window!.matchMedia(resolveRef(query).value)
    matches.value = mediaQuery.matches

    if ('addEventListener' in mediaQuery)
      mediaQuery.addEventListener('change', update)
    else
      // @ts-expect-error deprecated API
      mediaQuery.addListener(update)
  }
  watchEffect(update)

  tryOnScopeDispose(() => cleanup())

  return matches
}
