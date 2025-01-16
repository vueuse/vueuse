import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { ConfigurableNavigator } from '../_configurable'
import { tryOnMounted, tryOnScopeDispose } from '@vueuse/shared'
import { readonly, shallowRef, watch } from 'vue'

import { defaultNavigator } from '../_configurable'
import { useEventListener } from '../useEventListener'
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

  const device = shallowRef<undefined | BluetoothDevice>()

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

  const server = shallowRef<undefined | BluetoothRemoteGATTServer>()
  const isConnected = shallowRef(false)

  function reset() {
    isConnected.value = false
    device.value = undefined
    server.value = undefined
  }

  async function connectToBluetoothGATTServer() {
    // Reset any errors we currently have:
    error.value = null

    if (device.value && device.value.gatt) {
      // Add reset fn to gattserverdisconnected event:
      useEventListener(device, 'gattserverdisconnected', reset, { passive: true })

      try {
        // Connect to the device:
        server.value = await device.value.gatt.connect()
        isConnected.value = server.value.connected
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
    isConnected: readonly(isConnected),
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
  isSupported: ComputedRef<boolean>
  isConnected: Readonly<Ref<boolean>>
  device: Ref<BluetoothDevice | undefined>
  requestDevice: () => Promise<void>
  server: ShallowRef<BluetoothRemoteGATTServer | undefined>
  error: Ref<unknown | null>
}
