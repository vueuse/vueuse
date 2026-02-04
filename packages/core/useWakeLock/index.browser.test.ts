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

function createMockNavigator() {
  const sentinel = new MockWakeLockSentinel()
  const mockNavigator = {
    wakeLock: {
      request: async () => sentinel,
    },
  } as Navigator
  return { mockNavigator, sentinel }
}

describe('useWakeLock Browser', () => {
  it('should automatically release wake lock when component unmounts', async () => {
    const { mockNavigator } = createMockNavigator()

    const TestComponent = defineComponent({
      setup() {
        const wakeLock = useWakeLock({ navigator: mockNavigator })
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
    const { mockNavigator } = createMockNavigator()

    const { request, release, sentinel } = useWakeLock({ navigator: mockNavigator })
    expect(sentinel.value).toBe(null)

    await request('screen')

    expect(sentinel.value).toBeDefined()
    expect(sentinel.value!.released).toBeFalsy()

    await release()

    expect(sentinel.value).toBeNull()
  })
})
