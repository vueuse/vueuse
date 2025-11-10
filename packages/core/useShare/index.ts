import type { MaybeRefOrGetter } from 'vue'
import type { ConfigurableNavigator } from '../_configurable'
import { toValue } from 'vue'
import { defaultNavigator } from '../_configurable'
import { useSupported } from '../useSupported'

export interface UseShareOptions {
  title?: string
  files?: File[]
  text?: string
  url?: string
}

interface NavigatorWithShare {
  share?: (data: UseShareOptions) => Promise<void>
  canShare?: (data: UseShareOptions) => boolean
}

/**
 * Reactive Web Share API.
 *
 * @see https://vueuse.org/useShare
 * @param shareOptions
 * @param options
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useShare(shareOptions: MaybeRefOrGetter<UseShareOptions> = {}, options: ConfigurableNavigator = {}) {
  const { navigator = defaultNavigator } = options

  const _navigator = navigator as NavigatorWithShare
  const isSupported = useSupported(() => _navigator && 'canShare' in _navigator)

  const share = async (overrideOptions: MaybeRefOrGetter<UseShareOptions> = {}) => {
    if (isSupported.value) {
      const data = {
        ...toValue(shareOptions),
        ...toValue(overrideOptions),
      }
      let granted = false

      if (_navigator.canShare)
        granted = _navigator.canShare(data)

      if (granted)
        return _navigator.share!(data)
    }
  }

  return {
    isSupported,
    share,
  }
}

export type UseShareReturn = ReturnType<typeof useShare>
