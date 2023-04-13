import type { ComputedRef, Ref } from 'vue-demi'
import { computed, ref, shallowRef, watch } from 'vue-demi'
import { tryOnMounted, tryOnScopeDispose } from '@vueuse/shared'
import type { ConfigurableNavigator } from '../_configurable'

import { defaultNavigator } from '../_configurable'
import { useSupported } from '../useSupported'

export interface UseBluetoothRequestDeviceOptions {
  /**
    *
    * An array of BluetoothScanFilters. This filter consists of an array
    * of BluetoothServiceUUIDs, a name parameter, and a namePrefix parameter.
    *
    */
  filters?: BluetoothLEScanFilter[] | undefined
  /**
    *
    * An array of BluetoothServiceUUIDs.
    *
    * @see https://developer.mozilla.org/en-US/docs/Web/API/BluetoothRemoteGATTService/uuid
    *
    */
  optionalServices?: BluetoothServiceUUID[] | undefined
}

export interface UseBluetoothOptions extends UseBluetoothRequestDeviceOptions, ConfigurableNavigator {
  /**
    *
    * A boolean value indicating that the requesting script can accept all Bluetooth
    * devices. The default is false.
    *
    * !! This may result in a bunch of unrelated devices being shown
    * in the chooser and energy being wasted as there are no filters.
    *
    *
    * Use it with caution.
    *
    * @default false
    *
    */
  acceptAllDevices?: boolean
}

export function useBluetooth(options?: UseBluetoothOptions): UseBluetoothReturn {
  let {
    acceptAllDevices = false,
  } = options || {}

  const {
    filters = undefined,
    optionalServices = undefined,
    navigator = defaultNavigator,
  } = options || {}

  const isSupported = useSupported(() => navigator && 'bluetooth' in navigator)

  const device = shallowRef<undefined | BluetoothDevice>(undefined)

  const error = shallowRef<unknown | null>(null)

  watch(device, () => {
    connectToBluetoothGATTServer()
  })

  async function requestDevice(): Promise<void> {
    // This is the function can only be called if Bluetooth API is supported:
    if (!isSupported.value)
      return

    // Reset any errors we currently have:
    error.value = null

    // If filters specified, we need to ensure we  don't accept all devices:
    if (filters && filters.length > 0)
      acceptAllDevices = false

    try {
      device.value = await navigator?.bluetooth.requestDevice({
        acceptAllDevices,
        filters,
        optionalServices,
      })
    }
    catch (err) {
      error.value = err
    }
  }

  const server = ref<undefined | BluetoothRemoteGATTServer>()

  const isConnected = computed((): boolean => {
    return server.value?.connected || false
  })

  async function connectToBluetoothGATTServer() {
    // Reset any errors we currently have:
    error.value = null

    if (device.value && device.value.gatt) {
      // Add callback to gattserverdisconnected event:
      device.value.addEventListener('gattserverdisconnected', () => {})

      try {
        // Connect to the device:
        server.value = await device.value.gatt.connect()
      }
      catch (err) {
        error.value = err
      }
    }
  }

  tryOnMounted(() => {
    if (device.value)
      device.value.gatt?.connect()
  })

  tryOnScopeDispose(() => {
    if (device.value)
      device.value.gatt?.disconnect()
  })

  return {
    isSupported,
    isConnected,
    // Device:
    device,
    requestDevice,
    // Server:
    server,
    // Errors:
    error,
  }
}

export interface UseBluetoothReturn {
  isSupported: Ref<boolean>
  isConnected: ComputedRef<boolean>
  device: Ref<BluetoothDevice | undefined>
  requestDevice: () => Promise<void>
  server: Ref<BluetoothRemoteGATTServer | undefined>
  error: Ref<unknown | null>
}
