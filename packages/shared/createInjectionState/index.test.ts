import { type InjectionKey, type Ref, defineComponent, h, inject, ref } from 'vue-demi'
import { createInjectionState } from '@vueuse/shared'
import { describe, expect, it } from 'vitest'
import { mount } from '../../.test'

describe('createInjectionState', () => {
  it('should work 1', () => {
    const [useProvideCountState, useCountState] = createInjectionState((initialValue: number) => {
      const count = ref(initialValue)
      return count
    })

    const ChildComponent = defineComponent({
      setup() {
        const count = useCountState()
        expect(count?.value).toBe(0)

        return () => h('div')
      },
    })

    const RootComponent = defineComponent({
      setup() {
        useProvideCountState(0)

        return () => h(ChildComponent)
      },
    })

    mount(RootComponent)
  })

  it('should work (custom key)', () => {
    const KEY: InjectionKey<Ref<number>> = Symbol('count-state')

    const [useProvideCountState, useCountState] = createInjectionState((initialValue: number) => {
      const count = ref(initialValue)
      return count
    }, { injectionKey: KEY })

    const ChildComponent = defineComponent({
      setup() {
        const count = useCountState()
        expect(count?.value).toBe(0)
        const count2 = inject(KEY)
        expect(count2?.value).toBe(0)

        return () => h('div')
      },
    })

    const RootComponent = defineComponent({
      setup() {
        useProvideCountState(0)

        return () => h(ChildComponent)
      },
    })

    mount(RootComponent)
  })

  it('allow call provideLocal and injectLocal in same component', () => {
    const [useProvideCountState, useCountState] = createInjectionState((initialValue: number) => {
      const count = ref(initialValue)
      return count
    })

    const CanProvidingStateAndInjectedStateInSameComponent = defineComponent({
      setup() {
        useProvideCountState(114514)
        const count = useCountState()!
        expect(count.value).toBe(114514)

        return () => h('div')
      },
    })

    mount(CanProvidingStateAndInjectedStateInSameComponent)
  })
})
