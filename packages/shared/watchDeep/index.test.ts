import { describe, expect, it, vi } from 'vitest'
import { ref as deepRef, nextTick } from 'vue'
import { watchDeep } from './index'

describe('watchDeep', () => {
  it('should work when nested value is updated', async () => {
    const spy = vi.fn((objectUpdate) => {
      expect(objectUpdate).toEqual({ foo: { bar: { deep: 10 } } })
    })

    const obj = deepRef({ foo: { bar: { deep: 5 } } })
    watchDeep(obj, spy)
    obj.value.foo.bar.deep = 10
    await nextTick()
    expect(spy).toBeCalledTimes(1)
  })
})
