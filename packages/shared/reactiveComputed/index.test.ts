import { describe, expect, expectTypeOf, it } from 'vitest'
import { nextTick, shallowRef, watch, watchEffect } from 'vue'
import { reactiveComputed } from './index'

describe('reactiveComputed', () => {
  it('should work', () => {
    const count = shallowRef(0)

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
    const foo = shallowRef(false)

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

    await nextTick()

    expect(dummy).toBe(1)
    expect(type).toBe('foo')
  })

  it('should allow for previous value access (for vue 3.4+)', () => {
    const test = shallowRef(0)

    const obj = reactiveComputed<{ test: number, num: number }>(
      prev => ({ test: test.value, num: (prev?.num ?? 2) }),
    )

    obj.num = 5
    expect(obj).toMatchInlineSnapshot(`
      {
        "num": 5,
        "test": 0,
      }
    `)

    test.value = 1

    expect(obj).toMatchInlineSnapshot(`
      {
        "num": 5,
        "test": 1,
      }
    `)
  })
})
