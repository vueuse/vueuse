import { MaybeRef } from '@vueuse/shared'
import { ComputedRef, unref } from 'vue-demi'
import { ConfigurableNavigator, defaultNavigator } from '../_configurable'

export interface ShareOptions {
  title?: string
  files?: File[]
  text?: string
  url?: string
}

interface NavigatorWithShare {
  share?: (data: ShareOptions) => Promise<void>
  canShare?: (data: ShareOptions) => boolean
}

/**
 * Reactive Web Share API
 *
 * @use   {@link https://vueuse.js.org/useShare}
 * @param shareOptions
 * @param options
 */
export function useShare(shareOptions: MaybeRef<ShareOptions> | ComputedRef<ShareOptions> = {}, options: ConfigurableNavigator = {}) {
  const { navigator = defaultNavigator } = options

  const _navigator = (navigator as NavigatorWithShare)
  const isSupported = 'canShare' in _navigator

  const share = async(overrideOptions: MaybeRef<ShareOptions> | ComputedRef<ShareOptions> = {}) => {
    if (isSupported) {
      const data = {
        ...unref(shareOptions),
        ...unref(overrideOptions),
      }
      let granted = true

      if (data.files && _navigator.canShare)
        granted = _navigator.canShare({ files: data.files })

      if (granted)
        return _navigator.share!(data)
    }
  }

  return {
    isSupported,
    share,
  }
}
