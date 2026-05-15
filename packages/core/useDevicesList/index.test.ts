import { describe, expect, it, vi } from 'vitest'
import { useDevicesList } from './index'

describe('useDevicesList', () => {
  it('requests a stream before updating devices when permission is already granted', async () => {
    const devices = [
      { kind: 'audioinput' },
      { kind: 'videoinput' },
    ] as MediaDeviceInfo[]
    const stop = vi.fn()
    const enumerateDevices = vi.fn().mockResolvedValue(devices)
    const getUserMedia = vi.fn().mockResolvedValue({
      getTracks: () => [{ stop }],
    })
    const mediaDevices = Object.assign(new EventTarget(), {
      enumerateDevices,
      getUserMedia,
    })
    const permissionStatus = Object.assign(new EventTarget(), {
      state: 'granted' as PermissionState,
    })
    const navigator = {
      mediaDevices,
      permissions: {
        query: vi.fn().mockResolvedValue(permissionStatus),
      },
    } as unknown as Navigator

    const { ensurePermissions, permissionGranted, devices: listedDevices } = useDevicesList({ navigator })

    await expect(ensurePermissions()).resolves.toBe(true)

    expect(getUserMedia).toHaveBeenCalledWith({ audio: true, video: true })
    expect(stop).toHaveBeenCalledTimes(1)
    expect(permissionGranted.value).toBe(true)
    expect(listedDevices.value).toEqual(devices)
  })
})
