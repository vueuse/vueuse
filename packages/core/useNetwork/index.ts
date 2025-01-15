/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { ComputedRef, Ref } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import { readonly, ref } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'

export type NetworkType = 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown'

export type NetworkEffectiveType = 'slow-2g' | '2g' | '3g' | '4g' | undefined

export interface NetworkState {
  isSupported: ComputedRef<boolean>
  /**
   * If the user is currently connected.
   */
  isOnline: Readonly<Ref<boolean>>
  /**
   * The time since the user was last connected.
   */
  offlineAt: Readonly<Ref<number | undefined>>
  /**
   * At this time, if the user is offline and reconnects
   */
  onlineAt: Readonly<Ref<number | undefined>>
  /**
   * The download speed in Mbps.
   */
  downlink: Readonly<Ref<number | undefined>>
  /**
   * The max reachable download speed in Mbps.
   */
  downlinkMax: Readonly<Ref<number | undefined>>
  /**
   * The detected effective speed type.
   */
  effectiveType: Readonly<Ref<NetworkEffectiveType | undefined>>
  /**
   * The estimated effective round-trip time of the current connection.
   */
  rtt: Readonly<Ref<number | undefined>>
  /**
   * If the user activated data saver mode.
   */
  saveData: Readonly<Ref<boolean | undefined>>
  /**
   * The detected connection/network type.
   */
  type: Readonly<Ref<NetworkType>>
}

/**
 * Reactive Network status.
 *
 * @see https://vueuse.org/useNetwork
 * @param options
 */
export function useNetwork(options: ConfigurableWindow = {}): Readonly<NetworkState> {
  const { window = defaultWindow } = options
  const navigator = window?.navigator
  const isSupported = useSupported(() => navigator && 'connection' in navigator)

  const isOnline = ref(true)
  const saveData = ref(false)
  const offlineAt: Ref<number | undefined> = ref(undefined)
  const onlineAt: Ref<number | undefined> = ref(undefined)
  const downlink: Ref<number | undefined> = ref(undefined)
  const downlinkMax: Ref<number | undefined> = ref(undefined)
  const rtt: Ref<number | undefined> = ref(undefined)
  const effectiveType: Ref<NetworkEffectiveType> = ref(undefined)
  const type: Ref<NetworkType> = ref<NetworkType>('unknown')

  const connection = isSupported.value && (navigator as any).connection

  function updateNetworkInformation() {
    if (!navigator)
      return

    isOnline.value = navigator.onLine
    offlineAt.value = isOnline.value ? undefined : Date.now()
    onlineAt.value = isOnline.value ? Date.now() : undefined

    if (connection) {
      downlink.value = connection.downlink
      downlinkMax.value = connection.downlinkMax
      effectiveType.value = connection.effectiveType
      rtt.value = connection.rtt
      saveData.value = connection.saveData
      type.value = connection.type
    }
  }

  const listenerOptions = { passive: true }

  if (window) {
    useEventListener(window, 'offline', () => {
      isOnline.value = false
      offlineAt.value = Date.now()
    }, listenerOptions)

    useEventListener(window, 'online', () => {
      isOnline.value = true
      onlineAt.value = Date.now()
    }, listenerOptions)
  }

  if (connection)
    useEventListener(connection, 'change', updateNetworkInformation, listenerOptions)

  updateNetworkInformation()

  return {
    isSupported,
    isOnline: readonly(isOnline),
    saveData: readonly(saveData),
    offlineAt: readonly(offlineAt),
    onlineAt: readonly(onlineAt),
    downlink: readonly(downlink),
    downlinkMax: readonly(downlinkMax),
    effectiveType: readonly(effectiveType),
    rtt: readonly(rtt),
    type: readonly(type),
  }
}

export type UseNetworkReturn = ReturnType<typeof useNetwork>
