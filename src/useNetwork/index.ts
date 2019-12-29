import { onMounted, onUnmounted, ref, Ref } from '../api'

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

  function updateNetworkInformation () {
    isOnline.value = window.navigator.onLine
    offlineAt.value = isOnline.value ? undefined : Date.now()

    // skip for non supported browsers.
    if (!('connection' in window.navigator))
      return

    downlink.value = (window.navigator as any).connection.downlink
    downlinkMax.value = (window.navigator as any).connection.downlinkMax
    effectiveType.value = (window.navigator as any).connection.effectiveType
    saveData.value = (window.navigator as any).connection.saveData
    type.value = (window.navigator as any).connection.type
  }

  const onOffline = () => {
    isOnline.value = false
    offlineAt.value = Date.now()
  }

  const onOnline = () => {
    isOnline.value = true
  }

  onMounted(() => {
    updateNetworkInformation()
    window.addEventListener('offline', onOffline)
    window.addEventListener('online', onOnline)
    if ('connection' in window.navigator)
      (window.navigator as any).connection.addEventListener('change', updateNetworkInformation, false)
  })

  onUnmounted(() => {
    window.removeEventListener('offline', onOffline)
    window.removeEventListener('online', onOnline)
    if ('connection' in window.navigator)
      (window.navigator as any).connection.removeEventListener('change', updateNetworkInformation, false)
  })

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
