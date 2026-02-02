import type { WakeLockSentinel } from './index'
import { flushPromises, mount } from '@vue/test-utils'
import { useWakeLock } from '@vueuse/core'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

class MockWakeLockSentinel extends EventTarget {
  released = false
  release() {
    this.released = true
    return Promise.resolve()
  }
}

function defineWakeLockAPI() {
  const sentinel = new MockWakeLockSentinel()
  Object.defineProperty(navigator, 'wakeLock', {
    value: { request: async () => sentinel as WakeLockSentinel },
    writable: true,
  })
  return sentinel
}

describe('useWakeLock Browser', () => {
  it('should automatically release wake lock when component unmounts', async () => {
    defineWakeLockAPI()

    const TestComponent = defineComponent({
      setup() {
        const wakeLock = useWakeLock()
        wakeLock.request('screen')
        return { wakeLock }
      },
      template: '<div>Test</div>',
    })

    const wrapper = mount(TestComponent)
    await flushPromises()

    const { wakeLock } = wrapper.vm

    await vi.waitFor(() => {
      expect(wakeLock.sentinel.value).toBeTruthy()
    })

    expect(wakeLock.isActive.value).toBeTruthy()
    expect(wakeLock.sentinel.value).toBeTruthy()

    if (wakeLock.sentinel.value) {
      const sentinelBeforeUnmount = wakeLock.sentinel.value
      expect(sentinelBeforeUnmount.released).toBeFalsy()

      wrapper.unmount()
      await flushPromises()

      await vi.waitFor(() => {
        expect(wakeLock.sentinel.value).toBeNull()
        expect(sentinelBeforeUnmount.released).toBeTruthy()
        expect(wakeLock.isActive.value).toBeFalsy()
      })
    }
  })

  it('should handle wake lock lifecycle correctly', async () => {
    defineWakeLockAPI()

    const { isSupported, request, release, sentinel, isActive } = useWakeLock()

    expect(isSupported.value).toBeTruthy()

    await request('screen')

    await vi.waitFor(() => {
      expect(sentinel.value).toBeTruthy()
    })

    expect(isActive.value).toBeTruthy()
    expect(sentinel.value).toBeTruthy()

    await release()
    expect(isActive.value).toBeFalsy()
    expect(sentinel.value).toBeNull()
  })
})
