import { defineComponent, h, ref } from 'vue-demi'
import { createInjectionState } from '@vueuse/shared'
import { expect } from 'vitest'
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

describe('computedWithControl', () => {
  it('should work', () => {
    mount(RootComponent)
  })
})
