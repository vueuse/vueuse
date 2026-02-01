import { flushPromises, mount } from '@vue/test-utils'
import { useWakeLock } from '@vueuse/core'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

describe('useWakeLock Browser', () => {
  it('should automatically release wake lock when component unmounts', async () => {
    let wakeLockInstance: ReturnType<typeof useWakeLock> | null = null
    let sentinelBeforeUnmount: any = null

    const TestComponent = defineComponent({
      template: '<div>Test</div>',
      setup() {
        wakeLockInstance = useWakeLock()

        wakeLockInstance.request('screen').catch(() => {
        })

        return {}
      },
    })

    const wrapper = mount(TestComponent)
    await flushPromises()

    if (!wakeLockInstance!.isSupported.value) {
      wrapper.unmount()
      return
    }

    let attempts = 0
    while (!wakeLockInstance!.sentinel.value && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 50))
      attempts++
    }

    if (wakeLockInstance!.sentinel.value) {
      sentinelBeforeUnmount = wakeLockInstance!.sentinel.value
      expect(wakeLockInstance!.isActive.value).toBeTruthy()
      expect(wakeLockInstance!.sentinel.value).toBeTruthy()
      expect(wakeLockInstance!.sentinel.value?.released).toBeFalsy()

      wrapper.unmount()
      await flushPromises()

      await new Promise(resolve => setTimeout(resolve, 50))

      expect(wakeLockInstance!.sentinel.value).toBeNull()
      expect(sentinelBeforeUnmount.released).toBeTruthy()
      expect(wakeLockInstance!.isActive.value).toBeFalsy()
    }
    else {
      wrapper.unmount()
    }
  })

  it('should handle wake lock lifecycle correctly', async () => {
    const { isSupported, request, release, sentinel, isActive } = useWakeLock()

    if (!isSupported.value) {
      return
    }

    try {
      // Request wake lock (may fail due to permission denial in headless browsers)
      await request('screen')

      if (sentinel.value) {
        expect(isActive.value).toBeTruthy()
        expect(sentinel.value).toBeTruthy()

        // Release wake lock manually
        await release()
        expect(isActive.value).toBeFalsy()
        expect(sentinel.value).toBeNull()
      }
    }
    catch (error: any) {
      // In headless browsers, wake lock permission may be denied
      // This is expected behavior and not a test failure
      if (error.name === 'NotAllowedError' || error.message?.includes('permission')) {
        // Permission denied - skip this test
        return
      }
      // Re-throw unexpected errors
      throw error
    }
  })
})
