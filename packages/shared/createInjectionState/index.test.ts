import { type InjectionKey, type Ref, defineComponent, h, inject, nextTick, ref } from 'vue-demi'
import { createInjectionState, injectLocal } from '@vueuse/shared'
import { describe, expect, it } from 'vitest'
import { mount, useSetup } from '../../.test'

describe('createInjectionState', () => {
  it('should work for simple nested component', async () => {
    const [useProvideCountState, useCountState] = createInjectionState((initialValue: number) => {
      const count = ref(initialValue)
      return count
    })

    let count: Ref<number> | undefined

    const ChildComponent = defineComponent({
      setup() {
        count = useCountState()

        return () => h('div')
      },
    })

    const RootComponent = defineComponent({
      setup() {
        useProvideCountState(114514)

        return () => h(ChildComponent)
      },
    })

    const vm = mount(RootComponent)
    await nextTick()

    expect(count?.value).toBe(114514)
    vm.unmount()
  })

  it('should work for custom key', async () => {
    const KEY: InjectionKey<Ref<number>> = Symbol('count-state')

    const [useProvideCountState, useCountState] = createInjectionState((initialValue: number) => {
      const count = ref(initialValue)
      return count
    }, { injectionKey: KEY })

    let count: Ref<number> | undefined
    let count2: Ref<number> | undefined
    const ChildComponent = defineComponent({
      setup() {
        count = useCountState()
        count2 = inject(KEY)

        return () => h('div')
      },
    })

    const RootComponent = defineComponent({
      setup() {
        useProvideCountState(0)

        return () => h(ChildComponent)
      },
    })

    const vm = mount(RootComponent)
    await nextTick()
    expect(count?.value).toBe(0)
    expect(count2?.value).toBe(0)
    vm.unmount()
  })

  it('allow call useProvidingState and useInjectedState in same component', async () => {
    const [useProvideCountState, useCountState] = createInjectionState((initialValue: number) => {
      const count = ref(initialValue)
      return count
    })
    const vm = useSetup(() => {
      useProvideCountState(114514)
      const count = useCountState()!

      return { count }
    })
    await nextTick()
    expect(vm.count).toBe(114514)
    vm.unmount()
  })

  it('allow call useProvidingState and injectLocal in same component', async () => {
    const KEY: InjectionKey<Ref<number>> | string = Symbol('count-state')
    const [useProvideCountState] = createInjectionState((initialValue: number) => {
      const count = ref(initialValue)
      return count
    }, { injectionKey: KEY })
    const vm = useSetup(() => {
      useProvideCountState(114514)
      const count = injectLocal(KEY)!

      return { count }
    })
    await nextTick()
    expect(vm.count).toBe(114514)
    vm.unmount()
  })
})
