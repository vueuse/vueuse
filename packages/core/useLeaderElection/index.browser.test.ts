import { mount } from '@vue/test-utils'
import { useLeaderElection, useWebLocksAbortScopeDisposed } from '@vueuse/core'
import { promiseTimeout } from '@vueuse/shared'
import { describe, expect, it } from 'vitest'
import { type Ref, ref } from 'vue'

function nextFrame() {
  return promiseTimeout(15) // we assume that browser can handle lock requests in this time
}

describe('useLeaderElection', () => {
  it('should be supported', () => {
    const { isSupported } = useLeaderElection({ name: 'vitest-leader-1' })
    expect(isSupported.value).toBe(true)
  })
  it('should work as expected', async () => {
    const component = {
      template: '<span></span>',
      setup() {
        const { isSupported, isLeader } = useLeaderElection({ name: 'vitest-leader-2' })
        return { isSupported, isLeader }
      },
    }
    const wrapper1 = mount(component)
    const vm1 = wrapper1.vm
    expect(vm1.isSupported).toBe(true)
    await nextFrame()
    expect(vm1.isLeader).toBe(true)
    const wrapper2 = mount(component)
    const vm2 = wrapper2.vm
    expect(vm2.isSupported).toBe(true)
    await nextFrame()
    expect(vm2.isLeader).toBe(false)
    wrapper1.unmount()
    wrapper2.unmount()
    const wrapper3 = mount(component)
    const vm3 = wrapper3.vm
    expect(vm3.isSupported).toBe(true)
    await nextFrame()
    expect(vm3.isLeader).toBe(true)
    wrapper3.unmount()
  })
  it('should support dynamic names', async () => {
    let capturedName: Ref<string>
    const component = {
      template: '<span></span>',
      setup() {
        const name = ref('vitest-leader-3')
        const { isSupported, isLeader } = useLeaderElection({ name })
        capturedName = name
        return { isSupported, isLeader }
      },
    }
    const wrapper1 = mount(component)
    const vm1 = wrapper1.vm
    expect(vm1.isSupported).toBe(true)
    await nextFrame()
    expect(vm1.isLeader).toBe(true)
    capturedName!.value = 'vitest-leader-4'
    // isLeader is false right after the name change
    expect(vm1.isLeader).toBe(false)
    await nextFrame()
    expect(vm1.isLeader).toBe(true)
    wrapper1.unmount()
  })
  it('should abort the workload signal on scope dispose', async () => {
    let capturedAsLeader: ReturnType<typeof useLeaderElection>['asLeader']
    const component = {
      template: '<span></span>',
      setup() {
        const { isSupported, asLeader } = useLeaderElection({ name: 'vitest-leader-3' })
        capturedAsLeader = asLeader
        return { isSupported }
      },
    }
    const wrapper1 = mount(component)
    const vm1 = wrapper1.vm
    expect(vm1.isSupported).toBe(true)
    await nextFrame()
    expect(capturedAsLeader!(() => {})).toBe(true)
    let capturesReason
    capturedAsLeader!(async (signal) => {
      await promiseTimeout(250)
      capturesReason = signal?.reason
    })
    wrapper1.unmount()
    await promiseTimeout(300)
    expect(capturesReason).toBe(useWebLocksAbortScopeDisposed)
  })
})
