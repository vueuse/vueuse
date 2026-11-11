import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useWebNotification } from './index'

class MockNotification {
  static permission: NotificationPermission = 'granted'
  static requestPermission = vi.fn(async () => 'granted' as const)
  close = vi.fn()

  constructor(public title: string) {}
}

describe('useWebNotification', () => {
  let frame: HTMLIFrameElement
  let customWindow: Window
  let scope: ReturnType<typeof effectScope>

  beforeEach(() => {
    frame = document.createElement('iframe')
    document.body.appendChild(frame)
    if (!frame.contentWindow)
      throw new Error('Missing iframe window')
    customWindow = frame.contentWindow
    Object.defineProperty(customWindow, 'Notification', { value: MockNotification, configurable: true })
    MockNotification.permission = 'granted'
    MockNotification.requestPermission.mockClear()
    scope = effectScope()
    vi.stubGlobal('Notification', undefined)
  })

  afterEach(() => {
    scope.stop()
    frame.remove()
    vi.unstubAllGlobals()
  })

  it('uses the supplied window when the global constructor is unavailable', async () => {
    const result = scope.run(() => useWebNotification({ window: customWindow, requestPermissions: false }))!
    expect(result.isSupported.value).toBe(true)
    expect(result.permissionGranted.value).toBe(true)
    const notification = await result.show({ title: 'iframe' })
    expect(notification).toBeInstanceOf(MockNotification)
    expect(notification?.title).toBe('iframe')
    result.close()
    expect(notification?.close).toHaveBeenCalledOnce()
    expect(result.notification.value).toBeNull()
  })

  it('requests permission from the supplied window', async () => {
    const globalRequestPermission = vi.fn()
    vi.stubGlobal('Notification', Object.assign(vi.fn(), { permission: 'denied', requestPermission: globalRequestPermission }))
    MockNotification.permission = 'default'
    const result = scope.run(() => useWebNotification({ window: customWindow, requestPermissions: false }))!
    expect(result.permissionGranted.value).toBe(false)
    expect(await result.ensurePermissions()).toBe(true)
    expect(MockNotification.requestPermission).toHaveBeenCalledOnce()
    expect(globalRequestPermission).not.toHaveBeenCalled()
    expect(await result.show()).toBeInstanceOf(MockNotification)
  })

  it('keeps the default window working and closes on scope disposal', async () => {
    vi.stubGlobal('Notification', MockNotification)
    const result = scope.run(() => useWebNotification({ requestPermissions: false }))!
    const notification = await result.show({ title: 'default' })
    expect(notification?.title).toBe('default')
    scope.stop()
    expect(notification?.close).toHaveBeenCalledOnce()
  })

  it('does not request permission when the supplied window has denied it', async () => {
    MockNotification.permission = 'denied'
    const result = scope.run(() => useWebNotification({ window: customWindow, requestPermissions: false }))!
    expect(await result.ensurePermissions()).toBe(false)
    expect(MockNotification.requestPermission).not.toHaveBeenCalled()
    expect(await result.show()).toBeUndefined()
  })

  it('does not use the global constructor when the supplied window lacks support', async () => {
    Reflect.deleteProperty(customWindow, 'Notification')
    vi.stubGlobal('Notification', MockNotification)
    const result = scope.run(() => useWebNotification({ window: customWindow, requestPermissions: false }))!
    expect(result.isSupported.value).toBe(false)
    expect(await result.ensurePermissions()).toBeUndefined()
    expect(await result.show()).toBeUndefined()
  })
})
