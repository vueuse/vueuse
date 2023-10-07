import { defineComponent, h, ref } from 'vue-demi'
import { createInjectionState } from '@vueuse/shared'
import { describe, expect, it } from 'vitest'
import { mount } from '../../.test'

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

describe('createInjectionState simple example', () => {
  it('should work', () => {
    mount(RootComponent)
  })
})

const CanProvidingStateAndInjectedStateInSameComponent = defineComponent({
  setup() {
    useProvideCountState(114514)
    const count = useCountState()!
    expect(count.value).toBe(114514)

    return () => h('div')
  },
})

describe('allow call useProvidingState and useInjectedState in same component', () => {
  it('should work', () => {
    mount(CanProvidingStateAndInjectedStateInSameComponent)
  })
})
