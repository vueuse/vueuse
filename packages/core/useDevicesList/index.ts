/* this implementation is original ported from https://github.com/logaretm/vue-use-web by Abdelrahman Awad */

import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { ConfigurableNavigator } from '../_configurable'
import { computed, ref as deepRef, shallowRef } from 'vue'
import { defaultNavigator } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { usePermission } from '../usePermission'
import { useSupported } from '../useSupported'

export interface UseDevicesListOptions extends ConfigurableNavigator {
  onUpdated?: (devices: MediaDeviceInfo[]) => void
  /**
   * Request for permissions immediately if it's not granted,
   * otherwise label and deviceIds could be empty
   *
   * @default false
   */
  requestPermissions?: boolean
  /**
   * Request for types of media permissions
   *
   * @default { audio: true, video: true }
   */
  constraints?: MediaStreamConstraints
}

export interface UseDevicesListReturn {
  /**
   * All devices
   */
  devices: Ref<MediaDeviceInfo[]>
  videoInputs: ComputedRef<MediaDeviceInfo[]>
  audioInputs: ComputedRef<MediaDeviceInfo[]>
  audioOutputs: ComputedRef<MediaDeviceInfo[]>
  permissionGranted: ShallowRef<boolean>
  ensurePermissions: () => Promise<boolean>
  isSupported: ComputedRef<boolean>
}

/**
 * Reactive `enumerateDevices` listing available input/output devices
 *
 * @see https://vueuse.org/useDevicesList
 * @param options
 */
export function useDevicesList(options: UseDevicesListOptions = {}): UseDevicesListReturn {
  const {
    navigator = defaultNavigator,
    requestPermissions = false,
    constraints = { audio: true, video: true },
    onUpdated,
  } = options

  const devices = deepRef([]) as Ref<MediaDeviceInfo[]>
  const videoInputs = computed(() => devices.value.filter(i => i.kind === 'videoinput'))
  const audioInputs = computed(() => devices.value.filter(i => i.kind === 'audioinput'))
  const audioOutputs = computed(() => devices.value.filter(i => i.kind === 'audiooutput'))
  const isSupported = useSupported(() => navigator && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
  const permissionGranted = shallowRef(false)
  let stream: MediaStream | null

  async function update() {
    if (!isSupported.value)
      return

    devices.value = await navigator!.mediaDevices.enumerateDevices()
    onUpdated?.(devices.value)
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
      stream = null
    }
  }

  async function ensurePermissions() {
    const deviceName = constraints.video ? 'camera' : 'microphone'

    if (!isSupported.value)
      return false

    if (permissionGranted.value)
      return true

    const { state, query } = usePermission(deviceName, { controls: true })
    await query()
    if (state.value !== 'granted') {
      let granted = true
      try {
        stream = await navigator!.mediaDevices.getUserMedia(constraints)
      }
      catch {
        stream = null
        granted = false
      }
      update()
      permissionGranted.value = granted
    }
    else {
      permissionGranted.value = true
    }

    return permissionGranted.value
  }

  if (isSupported.value) {
    if (requestPermissions)
      ensurePermissions()

    useEventListener(navigator!.mediaDevices, 'devicechange', update, { passive: true })
    update()
  }

  return {
    devices,
    ensurePermissions,
    permissionGranted,
    videoInputs,
    audioInputs,
    audioOutputs,
    isSupported,
  }
}
