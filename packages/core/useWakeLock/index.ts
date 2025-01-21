import type { ConfigurableDocument, ConfigurableNavigator } from '../_configurable'
import { whenever } from '@vueuse/shared'
import { computed, ref, shallowRef } from 'vue'
import { defaultDocument, defaultNavigator } from '../_configurable'
import { useDocumentVisibility } from '../useDocumentVisibility'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'

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
export function useWakeLock(options: UseWakeLockOptions = {}) {
  const {
    navigator = defaultNavigator,
    document = defaultDocument,
  } = options
  const requestedType = ref<WakeLockType | false>(false)
  const sentinel = shallowRef<WakeLockSentinel | null>(null)
  const documentVisibility = useDocumentVisibility({ document })
  const isSupported = useSupported(() => navigator && 'wakeLock' in navigator)
  const isActive = computed(() => !!sentinel.value && documentVisibility.value === 'visible')

  if (isSupported.value) {
    useEventListener(sentinel, 'release', () => {
      requestedType.value = sentinel.value?.type ?? false
    }, { passive: true })

    whenever(
      () => documentVisibility.value === 'visible' && document?.visibilityState === 'visible' && requestedType.value,
      (type) => {
        requestedType.value = false
        forceRequest(type)
      },
    )
  }

  async function forceRequest(type: WakeLockType) {
    await sentinel.value?.release()
    sentinel.value = isSupported.value
      ? await (navigator as NavigatorWithWakeLock).wakeLock.request(type)
      : null
  }

  async function request(type: WakeLockType) {
    if (documentVisibility.value === 'visible')
      await forceRequest(type)
    else
      requestedType.value = type
  }

  async function release() {
    requestedType.value = false
    const s = sentinel.value
    sentinel.value = null
    await s?.release()
  }

  return {
    sentinel,
    isSupported,
    isActive,
    request,
    forceRequest,
    release,
  }
}

export type UseWakeLockReturn = ReturnType<typeof useWakeLock>
