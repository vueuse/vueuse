import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'
import type { ConfigurableDocument, ConfigurableNavigator } from '../_configurable'
import { defaultDocument, defaultNavigator } from '../_configurable'

type WakeLockType = 'screen'

export interface WakeLockSentinel extends EventTarget {
  type: WakeLockType
  released: boolean
  release: () => Promise<void>
}

type NavigatorWithWakeLock = Navigator & {
  wakeLock: { request: (type: WakeLockType) => Promise<WakeLockSentinel> }
}

export type UseWakeLockOptions = ConfigurableNavigator & ConfigurableDocument

/**
 * Reactive Screen Wake Lock API.
 *
 * @see https://vueuse.org/useWakeLock
 * @param options
 */
export const useWakeLock = (options: UseWakeLockOptions = {}) => {
  const {
    navigator = defaultNavigator,
    document = defaultDocument,
  } = options
  let wakeLock: WakeLockSentinel | null
  const isSupported = useSupported(() => navigator && 'wakeLock' in navigator)
  const isActive = ref(false)

  async function onVisibilityChange() {
    if (!isSupported.value || !wakeLock)
      return

    if (document && document.visibilityState === 'visible')
      wakeLock = await (navigator as NavigatorWithWakeLock).wakeLock.request('screen')

    isActive.value = !wakeLock.released
  }

  if (document)
    useEventListener(document, 'visibilitychange', onVisibilityChange, { passive: true })

  async function request(type: WakeLockType) {
    if (!isSupported.value)
      return
    wakeLock = await (navigator as NavigatorWithWakeLock).wakeLock.request(type)
    isActive.value = !wakeLock.released
  }

  async function release() {
    if (!isSupported.value || !wakeLock)
      return
    await wakeLock.release()
    isActive.value = !wakeLock.released
    wakeLock = null
  }

  return {
    isSupported,
    isActive,
    request,
    release,
  }
}

export type UseWakeLockReturn = ReturnType<typeof useWakeLock>
