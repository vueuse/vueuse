import type { InjectionKey, Ref } from 'vue'
import { createInjectionState, injectLocal } from '@vueuse/shared'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, inject, nextTick, shallowRef } from 'vue'
import { mount, useSetup } from '../../.test'

describe('createInjectionState', () => {
  it('should work for simple nested component', async () => {
    const [useProvideCountState, useCountState] = createInjectionState((initialValue: number) => {
      const count = shallowRef(initialValue)
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
      const count = shallowRef(initialValue)
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
      const count = shallowRef(initialValue)
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
      const count = shallowRef(initialValue)
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

  it('supports object destructuring with provide/inject aliases', async () => {
    const { provide, inject } = createInjectionState((n: number) => {
      const count = shallowRef(n)
      return count
    })

    let injected: Ref<number> | undefined

    const Child = defineComponent({
      setup() {
        injected = inject()
        return () => h('div')
      },
    })

    const Root = defineComponent({
      setup() {
        provide(7)
        return () => h(Child)
      },
    })

    const vm = mount(Root)
    await nextTick()
    expect(injected?.value).toBe(7)
    vm.unmount()
  })

  it('aliases are the same functions as original names', () => {
    const result = createInjectionState((n: number) => shallowRef(n))
    const [useProvidingState, useInjectedState] = result
    expect(result.provide).toBe(useProvidingState)
    expect(result.inject).toBe(useInjectedState)
    expect(result.useProvidingState).toBe(useProvidingState)
    expect(result.useInjectedState).toBe(useInjectedState)
  })

  it('mixed usage: tuple then object properties', () => {
    const pair = createInjectionState((n: number) => shallowRef(n))
    const [provide] = pair
    let injectedValue: number | undefined
    const vm = useSetup(() => {
      provide(3)
      injectedValue = pair.inject()!.value
      return {}
    })
    expect(injectedValue).toBe(3)
    vm.unmount()
  })

  it('returns defaultValue when not provided but defaultValue set', () => {
    const { inject } = createInjectionState((n: number) => shallowRef(n), { defaultValue: shallowRef(99) })
    let val: number | undefined
    const vm = useSetup(() => {
      val = inject()!.value
      return {}
    })
    expect(val).toBe(99)
    vm.unmount()
  })
})
