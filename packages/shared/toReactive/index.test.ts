import { describe, expect, it } from 'vitest'
import { ref as deepRef, isReactive, nextTick, reactive, watchSyncEffect } from 'vue'
import { toRefs } from '../toRefs'
import { toReactive } from './index'

describe('toReactive', () => {
  it('should be defined', () => {
    expect(toReactive).toBeDefined()
  })

  it('should work', () => {
    const r = deepRef({ a: 'a', b: 0 })
    const state = toReactive(r)
    expect(state.a).toBe('a')
    expect(state.b).toBe(0)

    r.value.a = 'b'
    r.value.b = 1
    expect(state.a).toBe('b')
    expect(state.b).toBe(1)
  })

  it('should be enumerable', () => {
    const obj = { a: 'a', b: 0 }
    const r = deepRef(obj)
    const state = toReactive(r)

    expect(JSON.stringify(state)).toBe(JSON.stringify(r.value))
    expect(state).toEqual(obj)
  })

  it('should be reactive', async () => {
    const r = deepRef({ a: 'a', b: 0 })
    const state = toReactive(r)
    let dummy = 0

    expect(state.a).toBe('a')
    expect(state.b).toBe(0)
    expect(isReactive(state)).toBe(true)

    watchSyncEffect(() => {
      dummy = state.b
    })

    expect(dummy).toBe(0)

    r.value.b += 1

    expect(dummy).toBe(1)

    state.b += 1

    expect(dummy).toBe(2)
    expect(r.value.b).toBe(2)
  })

  it('should be replaceable', async () => {
    const r = deepRef<any>({ a: 'a', b: 0 })
    const state = toReactive(r)
    let dummy = 0

    expect(state.a).toBe('a')
    expect(state.b).toBe(0)

    watchSyncEffect(() => {
      dummy = state.b
    })

    expect(dummy).toBe(0)

    r.value = { b: 1, a: 'a' }

    expect(dummy).toBe(1)

    state.b += 1

    await nextTick()

    expect(dummy).toBe(2)

    r.value = { a: 'c' }

    expect(dummy).toBe(undefined)
    expect(state).toEqual({ a: 'c' })
  })

  it('toReactive(toRefs())', () => {
    const a = reactive({ a: 'a', b: 0 })
    const b = toRefs(a)
    const c = toReactive(b)

    expect(a).toEqual(c)

    a.b = 1

    expect(c.b).toEqual(1)
  })
})
