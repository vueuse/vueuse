import { type InjectionKey, defineComponent, getCurrentInstance, h, nextTick } from 'vue-demi'
import { injectLocal, provideLocal } from '@vueuse/shared'
import { describe, expect, it } from 'vitest'
import { mount, useSetup } from '../../.test'

describe('provideLocal injectLocal deps', () => {
  it('depends on getCurrentInstance().proxy === getCurrentInstance().proxy', async () => {
    const vm = useSetup(() => {
      const instance1 = getCurrentInstance()
      const instance2 = getCurrentInstance()
      const instanceProxyStable = instance1?.proxy === instance2?.proxy
      return { instance1, instance2, instanceProxyStable }
    })
    await nextTick()
    expect(vm.instance1).not.toBeNull()
    expect(vm.instance2).not.toBeNull()
    expect(vm.instance1).toBeTypeOf('object')
    expect(vm.instance2).toBeTypeOf('object')
    expect(vm.instanceProxyStable).toBe(true)
    vm.unmount()
  })
})

describe('provideLocal injectLocal', () => {
  it('should work for nested component', async () => {
    const CountKey: InjectionKey<number> | string = Symbol('count')
    let count: number | undefined
    const ChildComponent = defineComponent({
      setup() {
        count = injectLocal(CountKey)

        return () => h('div')
      },
    })

    const RootComponent = defineComponent({
      setup() {
        provideLocal(CountKey, 2333)

        return () => h(ChildComponent)
      },
    })
    const vm = mount(RootComponent)
    await nextTick()

    expect(count).toBe(2333)
    vm.unmount()
  })

  it('should work for same component', async () => {
    const CountKey: InjectionKey<number> | string = Symbol('count')
    const vm = useSetup(() => {
      provideLocal(CountKey, 2333)
      const count = injectLocal(CountKey)!
      return { count }
    })
    await nextTick()
    expect(vm.count).toBe(2333)
    vm.unmount()
  })
})
