/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { onMounted, ref, Ref } from '../api'
import { useEventListener } from '../useEventListener'

export type NetworkType = 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown'

export type NetworkEffectiveType = 'slow-2g' | '2g' | '3g' | '4g' | undefined

export interface NetworkState {
  isOnline: boolean
  offlineAt: number | undefined
  downlink?: number
  downlinkMax?: number
  effectiveType?: NetworkEffectiveType
  saveData?: boolean
  type?: NetworkType
}

export function useNetwork () {
  const isOnline = ref(true)
  const saveData = ref(false)
  const offlineAt: Ref<number | undefined> = ref(undefined)
  const downlink: Ref<number | undefined> = ref(undefined)
  const downlinkMax: Ref<number | undefined> = ref(undefined)
  const effectiveType: Ref<NetworkEffectiveType> = ref(undefined)
  const type: Ref<NetworkType> = ref('unknown')

  const navigator = window.navigator
  const connection = 'connection' in navigator ? (navigator as any).connection : undefined

  function updateNetworkInformation () {
    isOnline.value = navigator.onLine
    offlineAt.value = isOnline.value ? undefined : Date.now()

    if (!connection)
      return

    downlink.value = connection.downlink
    downlinkMax.value = connection.downlinkMax
    effectiveType.value = connection.effectiveType
    saveData.value = connection.saveData
    type.value = connection.type
  }

  onMounted(updateNetworkInformation)

  useEventListener('offline', () => {
    isOnline.value = false
    offlineAt.value = Date.now()
  })

  useEventListener('online', () => {
    isOnline.value = true
  })

  if (connection)
    useEventListener('change', updateNetworkInformation, false, connection)

  return {
    isOnline,
    saveData,
    offlineAt,
    downlink,
    downlinkMax,
    effectiveType,
    type,
  }
}
