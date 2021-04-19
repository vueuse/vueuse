/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import { computed, ComputedRef, Ref, ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableNavigator, defaultNavigator } from '../_configurable'

export interface UseDevicesListOptions extends ConfigurableNavigator {
  onUpdated?: (devices: MediaDeviceInfo[]) => void
  /**
   * Request for permissions immediately if it's not granted,
   * otherwise label and deviceIds could be empty
   *
   * @default false
   */
  requestPermissions?: boolean
}

export interface UseDevicesListReturn {
  /**
   * All devices
   */
  devices: Ref<MediaDeviceInfo[]>
  videoInputs: ComputedRef<MediaDeviceInfo[]>
  audioInputs: ComputedRef<MediaDeviceInfo[]>
  audioOutputs: ComputedRef<MediaDeviceInfo[]>
  isSupported: boolean

  ensurePermissions: () => Promise<boolean>
}

/**
 * Reactive `enumerateDevices` listing avaliable input/output devices
 *
 * @link https://vueuse.org/useDevicesList
 * @param options
 */
export function useDevicesList(options: UseDevicesListOptions = {}): UseDevicesListReturn {
  const {
    navigator = defaultNavigator,
    requestPermissions = false,
    onUpdated,
  } = options

  const devices = ref([]) as Ref<MediaDeviceInfo[]>
  const videoInputs = computed(() => devices.value.filter(i => i.kind === 'videoinput'))
  const audioInputs = computed(() => devices.value.filter(i => i.kind === 'audioinput'))
  const audioOutputs = computed(() => devices.value.filter(i => i.kind === 'audiooutput'))
  let isSupported = false
  let granted = false

  async function update() {
    if (!isSupported)
      return

    devices.value = await navigator!.mediaDevices.enumerateDevices()
    onUpdated?.(devices.value)
  }

  async function ensurePermissions() {
    if (!isSupported)
      return false

    if (granted)
      return true

    const status = await navigator!.permissions.query({ name: 'device-info' })
    if (status.state !== 'granted') {
      const stream = await navigator!.mediaDevices.getUserMedia({ audio: true, video: true })
      stream.getTracks().forEach(t => t.stop())
      update()
      granted = (await navigator!.permissions.query({ name: 'device-info' })).state === 'granted'
    }
    else {
      granted = true
    }

    return granted
  }

  if (navigator) {
    isSupported = Boolean(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)

    if (isSupported) {
      if (requestPermissions)
        ensurePermissions()

      useEventListener(navigator.mediaDevices, 'devicechange', update)
      update()
    }
  }

  return {
    devices,
    ensurePermissions,
    videoInputs,
    audioInputs,
    audioOutputs,
    isSupported,
  }
}
