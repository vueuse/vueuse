import { isVue2, nextTick, ref, watch, watchEffect } from 'vue-demi'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { reactiveComputed } from '.'

describe('reactiveComputed', () => {
  it('should work', () => {
    const count = ref(0)

    const state = reactiveComputed(() => {
      return {
        count,
      }
    })
    expectTypeOf(state).toEqualTypeOf<{ count: number }>()

    expect(state.count).toBe(0)

    count.value++

    expect(state.count).toBe(1)
  })

  it('should work with dynamic props', async () => {
    const foo = ref(false)

    const state = reactiveComputed(() => {
      return foo.value
        ? { foo: true, type: 'foo' }
        : { bar: true, type: 'bar' }
    })

    let dummy = 0
    let type

    watch(state, () => {
      dummy += 1
    })
    watchEffect(() => {
      type = state.type
    })

    expect(state.foo).toBe(undefined)
    expect(state.bar).toBe(true)
    expect(type).toBe('bar')

    foo.value = true

    expect(state.foo).toBe(true)
    expect(state.bar).toBe(undefined)

    if (!isVue2) {
      await nextTick()

      expect(dummy).toBe(1)
      expect(type).toBe('foo')
    }
  })
})
