import type { WakeLockSentinel } from './index'
import { flushPromises, mount } from '@vue/test-utils'
import { useWakeLock } from '@vueuse/core'
import { describe, expect, it } from 'vitest'
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

    expect(wakeLock.sentinel.value).toBeDefined()

    wrapper.unmount()

    expect(wakeLock.sentinel.value).toBeNull()
  })

  it('should handle wake lock lifecycle correctly', async () => {
    defineWakeLockAPI()

    const { request, release, sentinel } = useWakeLock()
    expect(sentinel.value).toBe(null)

    await request('screen')

    expect(sentinel.value).toBeDefined()
    expect(sentinel.value!.released).toBeFalsy()

    await release()

    expect(sentinel.value).toBeNull()
  })
})
