import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useBattery } from './index'

class MockBatteryManager extends EventTarget {
  charging = true
  chargingTime = 400
  dischargingTime = 500
  level = 1
}

type NavigatorWithBattery = Navigator & {
  getBattery: () => Promise<MockBatteryManager>
}

function createMockNavigator() {
  const mockBattery = new MockBatteryManager()
  return {
    getBattery: vi.fn().mockResolvedValue(mockBattery),
  } as unknown as NavigatorWithBattery
}

describe('useMediaSession', () => {
  it('should be defined', () => {
    expect(useBattery).toBeDefined()
  })

  it('should not be be supported if `navigator.getBattery()` is not available', () => {
    const { isSupported } = useBattery({ navigator: {} as unknown as Navigator })
    expect(isSupported.value).toBe(false)
  })

  it('should provide states with correct values from `getBattery()`', async () => {
    const navigator = createMockNavigator()
    const { charging, chargingTime, dischargingTime, level } = useBattery({ navigator })

    await nextTick()

    expect(navigator.getBattery).toHaveBeenCalled()
    expect(charging.value).toBe(true)
    expect(chargingTime.value).toBe(400)
    expect(dischargingTime.value).toBe(500)
    expect(level.value).toBe(1)
  })

  it('should update states when event is fired', async () => {
    const navigator = createMockNavigator()
    const batteryManager = await navigator.getBattery()
    const { charging, chargingTime, dischargingTime, level } = useBattery({ navigator })

    await nextTick()

    expect(charging.value).toBe(true)
    expect(chargingTime.value).toBe(400)
    expect(dischargingTime.value).toBe(500)
    expect(level.value).toBe(1)

    batteryManager.charging = false
    batteryManager.chargingTime = 300
    batteryManager.dischargingTime = 400
    batteryManager.level = 0.5
    batteryManager.dispatchEvent(new Event('chargingchange'))
    batteryManager.dispatchEvent(new Event('chargingtimechange'))
    batteryManager.dispatchEvent(new Event('dischargingtimechange'))
    batteryManager.dispatchEvent(new Event('levelchange'))

    await nextTick()

    expect(charging.value).toBe(false)
    expect(chargingTime.value).toBe(300)
    expect(dischargingTime.value).toBe(400)
    expect(level.value).toBe(0.5)
  })
})
