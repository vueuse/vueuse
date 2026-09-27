import { flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSetup } from '../../.test'
import { useBluetooth } from './index'

function createMockBluetoothDevice(id: string) {
  const disconnectListeners = new Set<() => void>()
  const gatt = {
    connect: vi.fn(async () => ({
      connected: true,
    })),
    disconnect: vi.fn(),
  }

  const device = {
    id,
    gatt,
    addEventListener: vi.fn((event: string, listener: () => void) => {
      if (event === 'gattserverdisconnected')
        disconnectListeners.add(listener)
    }),
    removeEventListener: vi.fn((event: string, listener: () => void) => {
      if (event === 'gattserverdisconnected')
        disconnectListeners.delete(listener)
    }),
    dispatchDisconnect: () => {
      disconnectListeners.forEach(listener => listener())
    },
    get disconnectListenerCount() {
      return disconnectListeners.size
    },
  }

  return device as unknown as BluetoothDevice & {
    dispatchDisconnect: () => void
    disconnectListenerCount: number
  }
}

function createMockNavigator(devices: ReturnType<typeof createMockBluetoothDevice>[]) {
  let index = 0
  return {
    bluetooth: {
      requestDevice: vi.fn(async () => devices[index++]),
    },
  } as unknown as Navigator
}

describe('useBluetooth', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(useBluetooth).toBeDefined()
  })

  it('should not accumulate gattserverdisconnected listeners across device changes', async () => {
    const device1 = createMockBluetoothDevice('device-1')
    const device2 = createMockBluetoothDevice('device-2')
    const navigator = createMockNavigator([device1, device2])

    const vm = useSetup(() => {
      const api = useBluetooth({ navigator })
      return { api }
    })

    await vm.api.requestDevice()
    await vm.api.requestDevice()

    expect(device1.disconnectListenerCount).toBe(0)
    expect(device2.disconnectListenerCount).toBe(1)

    device2.dispatchDisconnect()
    expect(vm.api.isConnected.value).toBe(false)
    expect(vm.api.device.value).toBeUndefined()

    vm.unmount()
  })

  it('should update server and connection state after connecting', async () => {
    const device = createMockBluetoothDevice('device-1')
    const navigator = createMockNavigator([device])

    const vm = useSetup(() => {
      const api = useBluetooth({ navigator })
      return { api }
    })

    await vm.api.requestDevice()
    await flushPromises()

    expect(vm.api.server.value).toBeDefined()
    expect(vm.api.isConnected.value).toBe(true)

    vm.unmount()
  })
})
