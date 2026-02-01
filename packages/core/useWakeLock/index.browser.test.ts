import { flushPromises, mount } from '@vue/test-utils'
import { useWakeLock } from '@vueuse/core'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

describe('useWakeLock Browser', () => {
  it('should automatically release wake lock when component unmounts', async () => {
    let wakeLockInstance: ReturnType<typeof useWakeLock> | null = null
    let sentinelBeforeUnmount: any = null

    const TestComponent = defineComponent({
      template: '<div>Test</div>',
      setup() {
        wakeLockInstance = useWakeLock()

        wakeLockInstance.request('screen').catch(() => {})

        return {}
      },
    })

    const wrapper = mount(TestComponent)
    await flushPromises()

    if (!wakeLockInstance!.isSupported.value) {
      wrapper.unmount()
      return
    }

    await vi.waitFor(() => {
      expect(wakeLockInstance!.sentinel.value).toBeTruthy()
    }).catch(() => {
      // Permission denied in headless browser
    })

    // Skip test if permission was denied
    if (!wakeLockInstance!.sentinel.value) {
      wrapper.unmount()
      return
    }

    sentinelBeforeUnmount = wakeLockInstance!.sentinel.value
    expect(wakeLockInstance!.isActive.value).toBeTruthy()
    expect(wakeLockInstance!.sentinel.value).toBeTruthy()
    expect(wakeLockInstance!.sentinel.value?.released).toBeFalsy()

    wrapper.unmount()
    await flushPromises()

    await vi.waitFor(() => {
      expect(wakeLockInstance!.sentinel.value).toBeNull()
      expect(sentinelBeforeUnmount.released).toBeTruthy()
      expect(wakeLockInstance!.isActive.value).toBeFalsy()
    })
  })

  it('should handle wake lock lifecycle correctly', async () => {
    const { isSupported, request, release, sentinel, isActive } = useWakeLock()

    if (!isSupported.value)
      return

    await request('screen').catch(() => {})

    await vi.waitFor(() => {
      expect(sentinel.value).toBeTruthy()
    }).catch(() => {
      // Permission denied in headless browser
    })

    // Skip test if permission was denied
    if (!sentinel.value)
      return

    expect(isActive.value).toBeTruthy()
    expect(sentinel.value).toBeTruthy()

    await release()
    expect(isActive.value).toBeFalsy()
    expect(sentinel.value).toBeNull()
  })
})
